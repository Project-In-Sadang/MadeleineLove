package sideproject.madeleinelove.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import sideproject.madeleinelove.dto.WhitePostDto;
import sideproject.madeleinelove.dto.WhiteRequestDto;
import sideproject.madeleinelove.entity.User;
import sideproject.madeleinelove.entity.WhiteLike;
import sideproject.madeleinelove.entity.WhitePost;
import sideproject.madeleinelove.exception.PostErrorResult;
import sideproject.madeleinelove.exception.PostException;
import sideproject.madeleinelove.exception.UserErrorResult;
import sideproject.madeleinelove.exception.UserException;
import sideproject.madeleinelove.repository.UserRepository;
import sideproject.madeleinelove.repository.WhiteLikeRepository;
import sideproject.madeleinelove.repository.WhitePostRepository;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WhitePostService {

    private final WhitePostRepository whitePostRepository;
    private final WhiteLikeRepository whiteLikeRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final TokenServiceImpl tokenServiceImpl;
    private final UserRepository userRepository;
    private final WhiteLikeService whiteLikeService;

    public List<WhitePostDto> getPosts(HttpServletRequest request,
                                       HttpServletResponse response,
                                       String accessToken,
                                       String sort,
                                       String cursor,
                                       int size) {
        String userId = null;
        if (accessToken != null) {
            // 토큰이 있으면
            ObjectId objUserId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
            userId = objUserId.toHexString();
        }
        Pageable pageable = PageRequest.of(0, size + 1); // 다음 페이지 확인을 위해 size + 1

        List<WhitePost> posts;

        if (sort.equals("recommended")) {
            posts = getPostsByHotScore(cursor);
        } else if (sort.equals("latest")) {
            posts = getPostsByLatest(cursor, pageable);
        } else {
            throw new IllegalArgumentException("잘못된 sort 값입니다. 'recommended' 또는 'latest'만 허용됩니다. 전달된 값: " + sort);
        }

        boolean hasNext = (posts.size() > size);
        if (hasNext) {
            // 다음 페이지가 존재하므로, size 개까지만 잘라서 클라이언트에 전달
            posts = posts.subList(0, size);
        }

        // 사용자 좋아요 정보 가져오기
        Set<ObjectId> likedPostIds = getUserLikedPostIds(userId);

        // DTO 변환 및 isLiked 설정
        return posts.stream()
                .map(post -> convertToDto(post, likedPostIds))
                .collect(Collectors.toList());
    }

    public List<WhitePostDto> getBestPosts(HttpServletRequest request, HttpServletResponse response, String accessToken) {
        String userId = null;
        if (accessToken != null) {
            // 토큰이 있으면
            ObjectId objUserId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
            userId = objUserId.toHexString();
        }
        List<WhitePost> posts = whitePostRepository.findTop3ByOrderByLikeCountDesc();

        // 사용자 좋아요 정보 가져오기
        Set<ObjectId> likedPostIds = getUserLikedPostIds(userId);

        // DTO 변환 및 isLiked 설정
        return posts.stream()
                .map(post -> convertToDto(post, likedPostIds))
                .collect(Collectors.toList());
    }

    private List<WhitePost> getPostsByLatest(String cursor, Pageable pageable) {
        if (cursor == null) {
            return whitePostRepository.findAllByOrderByPostIdDesc(pageable);
        } else {
            ObjectId cursorId = new ObjectId(cursor);
            return whitePostRepository.findByPostIdLessThanOrderByPostIdDesc(cursorId, pageable);
        }
    }

    private List<WhitePost> getPostsByHotScore(String cursor) {
        // 1. 모든 게시물 로드 (주의: 데이터 많으면 부담)
        List<WhitePost> allPosts = whitePostRepository.findAll();

        // 2. 각 게시물 Hot Score 계산 & 임시 저장
        for (WhitePost post : allPosts) {
            // post.getHotScore()를 사용하여 점수 계산
            double hotScore = computeHotScore(post);
            post.setTempHotScore(hotScore);
        }

        // 3. 정렬: hotScore desc, 그 다음 postId desc
        allPosts.sort((p1, p2) -> {
            int cmp = Double.compare(p2.getTempHotScore(), p1.getTempHotScore());
            if (cmp != 0) return cmp;
            // hotScore 같다면 postId desc
            return p2.getPostId().compareTo(p1.getPostId());
        });

        // 4. 커서가 있다면, "hotScore_postId" 형태로 파싱 → 필터링
        if (cursor != null) {
            String[] parts = cursor.split("_");
            double cursorScore = Double.parseDouble(parts[0]);
            ObjectId cursorPostId = new ObjectId(parts[1]);

            // 'p2.getTempHotScore() < cursorScore || (== && p2.getPostId() < cursorPostId)'인 게시물만 남김
            allPosts = allPosts.stream()
                    .filter(p -> {
                        double s = p.getTempHotScore();
                        int cmpScore = Double.compare(s, cursorScore);
                        if (cmpScore < 0) {
                            return true; // s < cursorScore
                        } else if (cmpScore == 0) {
                            // s == cursorScore => postId < cursorPostId
                            return p.getPostId().compareTo(cursorPostId) < 0;
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
        }

        return allPosts;
    }

    private double computeHotScore(WhitePost post) {
        // 1. likeCount
        int likes = post.getLikeCount();

        // 2. ObjectId -> 생성 시간 (초 단위)
        long createdSec = post.getPostId().getTimestamp();
        long nowSec = System.currentTimeMillis() / 1000L;
        long ageSec = nowSec - createdSec;
        if (ageSec < 1) {
            ageSec = 1;
        }

        // 3. 간단한 공식: likeCount / (ageSec ^ 1.5)
        double hotScore = likes / Math.pow(ageSec, 1.5);
        return hotScore;
    }

    public String getNextCursor(List<WhitePostDto> dtos, String sort) {
        if (dtos.isEmpty()) {
            return null;
        }

        if ("best".equalsIgnoreCase(sort)) {
            return null;
        }

        WhitePostDto lastDto = dtos.get(dtos.size() - 1);

        if ("recommended".equalsIgnoreCase(sort)) {
            // hotScore_postId 형식의 커서 반환
            return String.format("%f_%s", lastDto.getHotScore(), lastDto.getPostId());
        } else {
            // postId를 커서로 반환
            return lastDto.getPostId();
        }
    }

    private Set<ObjectId> getUserLikedPostIds(String userId) {
        if (userId == null) {
            return Collections.emptySet();
        }
        List<WhiteLike> likes = whiteLikeRepository.findByUserId(userId);
        return likes.stream()
                .map(WhiteLike::getPostId)
                .collect(Collectors.toSet());
    }

    private WhitePostDto convertToDto(WhitePost post, Set<ObjectId> likedPostIds) {
        WhitePostDto dto = new WhitePostDto();
        dto.setPostId(post.getPostId().toHexString());
        dto.setNickName(post.getNickName());
        dto.setContent(post.getContent());
        dto.setMethodNumber(post.getMethodNumber());
        dto.setLikeCount(post.getLikeCount());
        dto.setLikedByUser(likedPostIds.contains(post.getPostId()));
        dto.setHotScore(post.getTempHotScore());
        return dto;
    }

    public void deleteWhitePost(HttpServletRequest request,
                                HttpServletResponse response,
                                String accessToken,
                                String stringPostId) {

        ObjectId userId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
        User existingUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

        ObjectId postId;
        WhitePost whitePost;
        try {
            postId = new ObjectId(stringPostId);
            whitePost = whitePostRepository.findByPostId(postId)
                    .orElseThrow(() -> new PostException(PostErrorResult.NOT_FOUND_POST));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid post id: " + stringPostId);
        }

        if (!whitePost.getUserId().equals(userId)) {
            throw new PostException(PostErrorResult.UNAUTHORIZED_ACCESS);
        }

        whiteLikeService.removeAllWhiteLikesForPost(postId);
        whitePostRepository.delete(whitePost);
        deletePostLikesFromRedis(postId);
    }

    public void deletePostLikesFromRedis(ObjectId postId) {
        try {
            String key = "whitepost:" + postId + ":likes";
            redisTemplate.delete(key);
        } catch (Exception e) {
            // 오류가 나도 서비스 흐름을 멈추지 않고 로그만 남김
            System.err.println("Failed to delete likes from Redis for postId: " + postId);
            e.printStackTrace();
        }
    }

    public void saveWhitePost(HttpServletRequest request,
                              HttpServletResponse response,
                              String accessToken,
                              WhiteRequestDto whiteRequestDto) {

        ObjectId userId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
        User existingUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

        WhitePost whitePost = createWhitePost(userId, whiteRequestDto);
        whitePostRepository.save(whitePost);
    }

    private WhitePost createWhitePost(ObjectId userId, WhiteRequestDto whiteRequestDto) {
        return WhitePost.builder()
                .postId(new ObjectId())
                .userId(userId)
                .nickName(whiteRequestDto.getNickName())
                .content(whiteRequestDto.getContent())
                .methodNumber(whiteRequestDto.getMethodNumber())
                .likeCount(0)
                .build();
    }
}
