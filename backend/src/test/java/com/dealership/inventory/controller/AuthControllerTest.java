package com.dealership.inventory.controller;

import com.dealership.inventory.config.SecurityConfig;
import com.dealership.inventory.dto.response.AuthResponse;
import com.dealership.inventory.domain.entity.Role;
import com.dealership.inventory.exception.GlobalExceptionHandler;
import com.dealership.inventory.security.JwtAuthFilter;
import com.dealership.inventory.service.AuthService;
import com.dealership.inventory.service.JwtService;
import com.dealership.inventory.service.UserDetailsServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // Mocked so the SecurityConfig filter chain can be wired without real infra
    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    // egister
    @Test
    @DisplayName("POST /api/auth/register → 201 with token in body")
    void register_validRequest_returns201() throws Exception {
        AuthResponse stubResponse = AuthResponse.builder()
                .token("jwt-token-abc")
                .email("alice@example.com")
                .role(Role.USER)
                .build();

        when(authService.register(any())).thenReturn(stubResponse);

        String body = """
                {
                  "email": "alice@example.com",
                  "password": "secret123"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token-abc"))
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @DisplayName("POST /api/auth/register with too-short password → 400")
    void register_shortPassword_returns400() throws Exception {
        String body = """
                {
                  "email": "alice@example.com",
                  "password": "short"
                }
                """;

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Password must be at least 8 characters"));
    }
}
