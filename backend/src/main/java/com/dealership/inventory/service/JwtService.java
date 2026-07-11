package com.dealership.inventory.service;

import com.dealership.inventory.domain.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration-ms}") long expirationMs) {
        // Decode the Base64-encoded secret so the raw key bytes are ≥ 256 bits
        // as required by RFC 7518 §3.2 for HMAC-SHA algorithms.
        byte[] keyBytes = Base64.getDecoder().decode(secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /**
     * Generates a signed JWT for the given user.
     * Subject = email; custom claim "role" = role name string.
     */
    public String generateToken(User user) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Extracts the email (subject) from a JWT.
     */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Extracts the role string from the "role" claim.
     */
    public String extractRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * Returns true when the token is structurally valid, correctly signed,
     * and not yet expired for the supplied user email.
     */
    public boolean isTokenValid(String token, String email) {
        try {
            Claims claims = parseClaims(token);
            return claims.getSubject().equals(email) && claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // private helpers
    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
