package sideproject.madeleinelove.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import sideproject.madeleinelove.dto.BlackPostDto;
import sideproject.madeleinelove.dto.BlackRequestDto;
import sideproject.madeleinelove.entity.*;
import sideproject.madeleinelove.exception.PostErrorResult;
import sideproject.madeleinelove.exception.PostException;
import sideproject.madeleinelove.exception.UserErrorResult;
import sideproject.madeleinelove.exception.UserException;
import sideproject.madeleinelove.repository.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlackPostService {

    private final BlackPostRepository blackPostRepository;
    private final BlackLikeRepository blackLikeRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final TokenServiceImpl tokenServiceImpl;
    private final UserRepository userRepository;
    private final BlackLikeService blackLikeService;


    public List<BlackPostDto> getPosts(HttpServletRequest request,
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

        List<BlackPost> posts;

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

    public List<BlackPostDto> getBestPosts(HttpServletRequest request, HttpServletResponse response, String accessToken) {
        String userId = null;
        if (accessToken != null) {
            // 토큰이 있으면
            ObjectId objUserId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
            userId = objUserId.toHexString();
        }
        List<BlackPost> posts = blackPostRepository.findTop3ByOrderByLikeCountDesc();

        // 사용자 좋아요 정보 가져오기
        Set<ObjectId> likedPostIds = getUserLikedPostIds(userId);

        // DTO 변환 및 isLiked 설정
        return posts.stream()
                .map(post -> convertToDto(post, likedPostIds))
                .collect(Collectors.toList());
    }

    private List<BlackPost> getPostsByLatest(String cursor, Pageable pageable) {
        if (cursor == null || cursor.isBlank()) {
            return blackPostRepository.findAllByOrderByPostIdDesc(pageable);
        } else {
            ObjectId cursorId = new ObjectId(cursor);
            return blackPostRepository.findByPostIdLessThanOrderByPostIdDesc(cursorId, pageable);
        }
    }

    private List<BlackPost> getPostsByHotScore(String cursor) {
        // 1. 모든 게시물 로드 (주의: 데이터 많으면 부담)
        List<BlackPost> allPosts = blackPostRepository.findAll();

        // 2. 각 게시물 Hot Score 계산 & 임시 저장
        for (BlackPost post : allPosts) {
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

        // 4. 커서가 null이거나 빈 문자열("")이면 -> 첫 페이지 (필터링 안 함)
        if (cursor == null || cursor.isBlank()) {
            return allPosts;
        }

        // "hotScore_postId" 형태로 파싱 → 필터링
        String[] parts = cursor.split("_");
        double cursorScore = Double.parseDouble(parts[0]);
        ObjectId cursorPostId = new ObjectId(parts[1]);

        // 'p2.getTempHotScore() < cursorScore || (== && p2.getPostId() < cursorPostId)'
        // 인 게시물만 남김
        return allPosts.stream()
                .filter(p -> {
                    double s = p.getTempHotScore();
                    int cmpScore = Double.compare(s, cursorScore);
                    if (cmpScore < 0) {
                        return true; // s < cursorScore
                    } else if (cmpScore == 0) {
                        return p.getPostId().compareTo(cursorPostId) < 0;
                    }
                    return false;
                })
                .collect(Collectors.toList());
    }

    private double computeHotScore(BlackPost post) {
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

    public String getNextCursor(List<BlackPostDto> dtos, String sort) {
        if (dtos.isEmpty()) {
            return null;
        }

        if ("best".equalsIgnoreCase(sort)) {
            return null;
        }

        BlackPostDto lastDto = dtos.get(dtos.size() - 1);

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
        List<BlackLike> likes = blackLikeRepository.findByUserId(userId);
        return likes.stream()
                .map(BlackLike::getPostId)
                .collect(Collectors.toSet());
    }

    private BlackPostDto convertToDto(BlackPost post, Set<ObjectId> likedPostIds) {
        BlackPostDto dto = new BlackPostDto();
        dto.setPostId(post.getPostId().toHexString());
        dto.setNickName(post.getNickName());
        dto.setContent(post.getContent());
        dto.setMethodNumber(post.getMethodNumber());
        dto.setLikeCount(post.getLikeCount());
        dto.setLikedByUser(likedPostIds.contains(post.getPostId()));
        dto.setHotScore(post.getTempHotScore());

        return dto;
    }

    public void deleteBlackPost(HttpServletRequest request, HttpServletResponse response,
                                String accessToken, String stringPostId) {

        ObjectId userId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
        User existingUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

        ObjectId postId;
        BlackPost blackPost;
        try {
            postId = new ObjectId(stringPostId);
            blackPost = blackPostRepository.findByPostId(postId)
                    .orElseThrow(() -> new PostException(PostErrorResult.NOT_FOUND_POST));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid post id: " + stringPostId);
        }

        if (!blackPost.getUserId().equals(userId)) {
            throw new PostException(PostErrorResult.UNAUTHORIZED_ACCESS);
        }

        blackLikeService.removeAllBlackLikesForPost(postId);
        blackPostRepository.delete(blackPost);
        deletePostLikesFromRedis(postId);
    }

    public void deletePostLikesFromRedis(ObjectId postId) {
        try {
            String key = "blackpost:" + postId + ":likes";
            redisTemplate.delete(key);
        } catch (Exception e) {
            // Log the error without interrupting the main flow
            System.err.println("Failed to delete likes from Redis for postId: " + postId);
            e.printStackTrace();
        }
    }

    public void saveBlackPost(HttpServletRequest request, HttpServletResponse response,
                              String accessToken, BlackRequestDto blackRequestDto) {

        ObjectId userId = tokenServiceImpl.getUserIdFromAccessToken(request, response, accessToken);
        User existingUser = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException(UserErrorResult.NOT_FOUND_USER));

        BlackPost blackPost = createBlackPost(userId, blackRequestDto);
        blackPostRepository.save(blackPost);
    }

    private BlackPost createBlackPost(ObjectId userId, BlackRequestDto blackRequestDto) {
        return BlackPost.builder()
                .postId(new ObjectId())
                .userId(userId)
                .nickName(blackRequestDto.getNickName())
                .content(blackRequestDto.getContent())
                .methodNumber(blackRequestDto.getMethodNumber())
                .likeCount(0)
                .build();
    }
}