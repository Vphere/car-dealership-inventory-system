package com.dealership.inventory.controller;

import com.dealership.inventory.config.SecurityConfig;
import com.dealership.inventory.domain.entity.Role;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.exception.GlobalExceptionHandler;
import com.dealership.inventory.security.JwtAuthFilter;
import com.dealership.inventory.service.JwtService;
import com.dealership.inventory.service.UserDetailsServiceImpl;
import com.dealership.inventory.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VehicleController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, GlobalExceptionHandler.class})
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private VehicleService vehicleService;

    // Required so SecurityConfig / JwtAuthFilter can be wired without real infra
    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    // ── GET /api/vehicles ─────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/vehicles → 200 with vehicle list")
    @WithMockUser(roles = "USER")
    void getAll_authenticatedUser_returns200WithList() throws Exception {
        VehicleResponse camry = VehicleResponse.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();

        when(vehicleService.getAll()).thenReturn(List.of(camry));

        mockMvc.perform(get("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[0].quantity").value(10));
    }

    // ── DELETE /api/vehicles/{id} ─────────────────────────────────────────────

    @Test
    @DisplayName("DELETE /api/vehicles/{id} as ADMIN → 204 No Content")
    @WithMockUser(roles = "ADMIN")
    void delete_asAdmin_returns204() throws Exception {
        doNothing().when(vehicleService).delete(1L);

        mockMvc.perform(delete("/api/vehicles/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/vehicles/{id} as USER → 403 Forbidden")
    @WithMockUser(roles = "USER")
    void delete_asUser_returns403() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1"))
                .andExpect(status().isForbidden());
    }
}
