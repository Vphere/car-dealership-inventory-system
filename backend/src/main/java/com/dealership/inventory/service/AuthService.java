package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.LoginRequest;
import com.dealership.inventory.dto.request.RegisterRequest;
import com.dealership.inventory.dto.response.AuthResponse;

public interface AuthService {

    /**
     * Registers a new user.
     * Throws {@link com.dealership.inventory.exception.DuplicateEmailException}
     * if the email is already in use.
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates an existing user.
     * Throws {@link org.springframework.security.authentication.BadCredentialsException}
     * if the email is not found or the password does not match.
     */
    AuthResponse login(LoginRequest request);
}
