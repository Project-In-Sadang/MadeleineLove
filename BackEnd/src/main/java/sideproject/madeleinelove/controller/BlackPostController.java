package sideproject.madeleinelove.controller;

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
import sideproject.madeleinelove.service.BlackPostService;
import sideproject.madeleinelove.service.TokenServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class BlackPostController {

    @Autowired
    private BlackPostService blackPostService;

    @Autowired
    private TokenServiceImpl tokenServiceImpl;

    @DeleteMapping("/black/{postId}")
    public ResponseEntity<?> deleteBlackPost(HttpServletRequest request, HttpServletResponse response,
                                             @Valid @RequestHeader("Authorization") String authorizationHeader,
                                             @PathVariable String postId) {
        try{
            TokenDTO.TokenResponse accessTokenToUse = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
            blackPostService.deleteBlackPost(request, response, accessTokenToUse.getAccessToken(), postId);
            return ApiResponse.onSuccess(SuccessStatus._DELETED, accessTokenToUse);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/black/post")
    public ResponseEntity<PagedResponse<BlackPostDto>> getPosts(
            HttpServletRequest request, HttpServletResponse response,
            @Valid @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam(defaultValue = "latest") String sort,
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "10") int size) {
        TokenDTO.TokenResponse accessTokenToUse = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
        List<BlackPostDto> dtos = blackPostService.getPosts(request, response, accessTokenToUse.getAccessToken(), sort, cursor, size);

        String nextCursor = blackPostService.getNextCursor(dtos, sort);

        PagedResponse<BlackPostDto> pagedResponse = new PagedResponse<>();
        pagedResponse.setData(dtos);
        pagedResponse.setNextCursor(nextCursor);

        return ResponseEntity.ok(pagedResponse);
    }

    @PostMapping("/black")
    public ResponseEntity<ApiResponse<Object>> createBlackPost(HttpServletRequest request, HttpServletResponse response,
                                                               @Valid @RequestHeader("Authorization") String authorizationHeader,
                                                               @Valid @RequestBody BlackRequestDto blackRequestDto) {

        TokenDTO.TokenResponse accessTokenToUse = tokenServiceImpl.validateAccessToken(request, response, authorizationHeader);
        blackPostService.saveBlackPost(request, response, accessTokenToUse.getAccessToken(), blackRequestDto);

        return ApiResponse.onSuccess(SuccessStatus._CREATED, accessTokenToUse);
    }

}