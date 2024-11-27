package sideproject.madeleinelove.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sideproject.madeleinelove.auth.CookieUtil;
import sideproject.madeleinelove.auth.JwtUtil;
import sideproject.madeleinelove.dto.TokenDTO;
import sideproject.madeleinelove.entity.RefreshToken;
import sideproject.madeleinelove.exception.TokenErrorResult;
import sideproject.madeleinelove.exception.TokenException;
import sideproject.madeleinelove.repository.RefreshTokenRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {
    @Value("${jwt.access-token.expiration-time}")
    private long ACCESS_TOKEN_EXPIRATION_TIME;

    @Value("${jwt.refresh-token.expiration-time}")
    private long REFRESH_TOKEN_EXPIRATION_TIME;

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    @Override
    public TokenDTO.TokenResponse reissueAccessToken(HttpServletRequest request, HttpServletResponse response) {
        Cookie cookie = cookieUtil.getCookie(request);
        String refreshToken = cookie.getValue();

        String userIdString = jwtUtil.getUserIdFromToken(refreshToken);

        if (userIdString == null || userIdString.length() != 24 || !userIdString.matches("[0-9a-fA-F]{24}")) {
            throw new IllegalArgumentException("Invalid userId format");
        }
        ObjectId userId = new ObjectId(userIdString);

        RefreshToken existRefreshToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new TokenException(TokenErrorResult.REFRESH_TOKEN_NOT_FOUND));
        String newAccessToken;

        if (!existRefreshToken.getRefreshToken().equals(refreshToken) || jwtUtil.isTokenExpired(refreshToken)) {
            // 리프레쉬 토큰이 다르거나, 만료된 경우
            throw new TokenException(TokenErrorResult.INVALID_REFRESH_TOKEN); // 401 에러를 던져 재로그인을 요청
        } else {
            // 액세스 토큰 재발급
            newAccessToken = jwtUtil.generateAccessToken(userId, ACCESS_TOKEN_EXPIRATION_TIME);
        }

        // 리프레쉬 토큰이 담긴 쿠키 생성 후 설정
        ResponseCookie newCookie = cookieUtil.createCookie(userId, REFRESH_TOKEN_EXPIRATION_TIME);
        response.addHeader("Set-Cookie", newCookie.toString());

        // 새로운 리프레쉬 토큰 Redis 저장
        RefreshToken newRefreshToken = new RefreshToken(userId, newCookie.getValue());
        refreshTokenRepository.save(newRefreshToken);

        // 새로운 액세스 토큰을 담아 반환
        return TokenDTO.TokenResponse.of(newAccessToken);
    }
}