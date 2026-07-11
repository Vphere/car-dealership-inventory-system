package com.dealership.inventory.service;

import com.dealership.inventory.domain.entity.Role;
import com.dealership.inventory.domain.entity.User;
import com.dealership.inventory.domain.repository.UserRepository;
import com.dealership.inventory.dto.request.LoginRequest;
import com.dealership.inventory.dto.request.RegisterRequest;
import com.dealership.inventory.dto.response.AuthResponse;
import com.dealership.inventory.exception.DuplicateEmailException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;          // does not exist yet

    // class under test — does not exist yet
    private AuthService authService;        // interface does not exist yet

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(userRepository, passwordEncoder, jwtService);
    }

    // registration
    @Test
    @DisplayName("register: success → returns AuthResponse with token")
    void register_success_returnsAuthResponse() {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("alice@example.com");
        request.setPassword("secret123");

        User savedUser = User.builder()
                .id(1L)
                .email("alice@example.com")
                .password("hashed")
                .role(Role.USER)
                .build();

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(savedUser)).thenReturn("jwt-token-abc");

        // when
        AuthResponse response = authService.register(request);

        // then
        assertThat(response.getToken()).isEqualTo("jwt-token-abc");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getRole()).isEqualTo(Role.USER);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: duplicate email → throws DuplicateEmailException")
    void register_duplicateEmail_throwsDuplicateEmailException() {
        // given
        RegisterRequest request = new RegisterRequest();
        request.setEmail("bob@example.com");
        request.setPassword("secret123");

        when(userRepository.existsByEmail("bob@example.com")).thenReturn(true);

        // when / then
        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(DuplicateEmailException.class)
                .hasMessageContaining("bob@example.com");

        verify(userRepository, never()).save(any(User.class));
    }

    // login
    @Test
    @DisplayName("login: correct credentials → returns AuthResponse with token")
    void login_correctCredentials_returnsAuthResponse() {
        // given
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@example.com");
        request.setPassword("secret123");

        User storedUser = User.builder()
                .id(1L)
                .email("alice@example.com")
                .password("hashed")
                .role(Role.USER)
                .build();

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(storedUser));
        when(passwordEncoder.matches("secret123", "hashed")).thenReturn(true);
        when(jwtService.generateToken(storedUser)).thenReturn("jwt-token-xyz");

        // when
        AuthResponse response = authService.login(request);

        // then
        assertThat(response.getToken()).isEqualTo("jwt-token-xyz");
        assertThat(response.getEmail()).isEqualTo("alice@example.com");
        assertThat(response.getRole()).isEqualTo(Role.USER);
    }

    @Test
    @DisplayName("login: wrong password → throws BadCredentialsException")
    void login_wrongPassword_throwsBadCredentialsException() {
        // given
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@example.com");
        request.setPassword("wrongpassword");

        User storedUser = User.builder()
                .id(1L)
                .email("alice@example.com")
                .password("hashed")
                .role(Role.USER)
                .build();

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(storedUser));
        when(passwordEncoder.matches("wrongpassword", "hashed")).thenReturn(false);

        // when / then
        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);

        verify(jwtService, never()).generateToken(any(User.class));
    }
}
