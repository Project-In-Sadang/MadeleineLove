package sideproject.madeleinelove.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import sideproject.madeleinelove.base.ApiResponse;
import sideproject.madeleinelove.base.SuccessStatus;
import sideproject.madeleinelove.dto.*;
import sideproject.madeleinelove.exception.TokenException;
import sideproject.madeleinelove.service.TokenServiceImpl;
import sideproject.madeleinelove.service.WhitePostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class WhitePostController {

    @Autowired
    private WhitePostService whitePostService;

    @Autowired
    private TokenServiceImpl tokenServiceImpl;

    @DeleteMapping("/white/{postId}")
    public ResponseEntity<?> deleteWhitePost(HttpServletRequest request, HttpServletResponse response,
                                             @RequestHeader("Authorization") String authorizationHeader,
                                             @PathVariable String postId) {
        try{
            TokenDTO.TokenResponse accessTokenToUse = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
            whitePostService.deleteWhitePost(request, response, accessTokenToUse.getAccessToken(), postId);
            return ApiResponse.onSuccess(SuccessStatus._DELETED, accessTokenToUse);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(security = {})
    @GetMapping("/white/post")
    public ResponseEntity<PagedResponse<WhitePostDto>> getPosts(
            HttpServletRequest request, HttpServletResponse response,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") int size) {
        String accessToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                TokenDTO.TokenResponse tokenRes = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
                accessToken = tokenRes.getAccessToken();
            } catch (TokenException e) {
                // 여기서 401을 반환할지, 게스트로 처리할지 결정
                // 예: 게스트로 허용
                accessToken = null;
            }
        }

        List<WhitePostDto> dtos = whitePostService.getPosts(request, response, accessToken, sort, cursor, size);

        String nextCursor = whitePostService.getNextCursor(dtos, sort);
        PagedResponse<WhitePostDto> pagedResponse = new PagedResponse<>();
        pagedResponse.setData(dtos);
        pagedResponse.setNextCursor(nextCursor);

        return ResponseEntity.ok(pagedResponse);
    }

    @Operation(security = {})
    @GetMapping("/white/post/best")
    public ResponseEntity<PagedResponse<WhitePostDto>> getBestPosts(
            HttpServletRequest request, HttpServletResponse response,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        String accessToken = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                TokenDTO.TokenResponse tokenRes = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
                accessToken = tokenRes.getAccessToken();
            } catch (TokenException e) {
                accessToken = null;
            }
        }
        List<WhitePostDto> dtos = whitePostService.getBestPosts(request, response, accessToken);

        PagedResponse<WhitePostDto> pagedResponse = new PagedResponse<>();
        pagedResponse.setData(dtos);

        return ResponseEntity.ok(pagedResponse);
    }

    @PostMapping("/white")
    public ResponseEntity<ApiResponse<Object>> createWhitePost(HttpServletRequest request, HttpServletResponse response,
                                                                  @RequestHeader("Authorization") String authorizationHeader,
                                                                  @RequestBody WhiteRequestDto whiteRequestDto) {

        TokenDTO.TokenResponse accessTokenToUse = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
        whitePostService.saveWhitePost(request, response, accessTokenToUse.getAccessToken(), whiteRequestDto);

        return ApiResponse.onSuccess(SuccessStatus._CREATED, accessTokenToUse);
    }

}