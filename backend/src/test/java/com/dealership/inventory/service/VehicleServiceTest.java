package com.dealership.inventory.service;

import com.dealership.inventory.domain.entity.Vehicle;
import com.dealership.inventory.domain.repository.VehicleRepository;
import com.dealership.inventory.dto.request.RestockRequest;
import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.exception.InsufficientStockException;
import com.dealership.inventory.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * RED phase — VehicleService interface and VehicleServiceImpl do not exist yet.
 * This class will not compile until those production classes are created in the next commit.
 */
@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    // Neither the interface nor the implementation exists yet
    private VehicleService vehicleService;

    // shared fixtures
    private VehicleRequest sedan() {
        VehicleRequest req = new VehicleRequest();
        req.setMake("Toyota");
        req.setModel("Camry");
        req.setCategory("Sedan");
        req.setPrice(new BigDecimal("25000.00"));
        req.setQuantity(10);
        return req;
    }

    private Vehicle savedSedan() {
        return Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(10)
                .build();
    }

    @BeforeEach
    void setUp() {
        vehicleService = new VehicleServiceImpl(vehicleRepository);
    }

    // create
    @Test
    @DisplayName("create: valid request → saved entity mapped to VehicleResponse")
    void create_validRequest_returnsMappedResponse() {
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(savedSedan());

        VehicleResponse response = vehicleService.create(sedan());

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getMake()).isEqualTo("Toyota");
        assertThat(response.getModel()).isEqualTo("Camry");
        assertThat(response.getCategory()).isEqualTo("Sedan");
        assertThat(response.getPrice()).isEqualByComparingTo("25000.00");
        assertThat(response.getQuantity()).isEqualTo(10);
        verify(vehicleRepository).save(any(Vehicle.class));
    }

    // getAll
    @Test
    @DisplayName("getAll: repository returns list → every element mapped to VehicleResponse")
    void getAll_repositoryReturnsList_returnsMappedList() {
        Vehicle suv = Vehicle.builder()
                .id(2L)
                .make("Honda")
                .model("CR-V")
                .category("SUV")
                .price(new BigDecimal("32000.00"))
                .quantity(5)
                .build();

        when(vehicleRepository.findAll()).thenReturn(List.of(savedSedan(), suv));

        List<VehicleResponse> responses = vehicleService.getAll();

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getId()).isEqualTo(1L);
        assertThat(responses.get(1).getId()).isEqualTo(2L);
        assertThat(responses.get(1).getMake()).isEqualTo("Honda");
    }

    // update
    @Test
    @DisplayName("update: non-existent id → throws ResourceNotFoundException")
    void update_nonExistentId_throwsResourceNotFoundException() {
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> vehicleService.update(99L, sedan()))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");

        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    // purchase
    @Test
    @DisplayName("purchase: in-stock vehicle → quantity decreases by exactly 1")
    void purchase_inStockVehicle_decrementsQuantityByOne() {
        Vehicle locked = savedSedan(); // quantity = 10
        when(vehicleRepository.findByIdWithLock(1L)).thenReturn(Optional.of(locked));
        when(vehicleRepository.save(locked)).thenReturn(locked);

        VehicleResponse response = vehicleService.purchase(1L);

        assertThat(response.getQuantity()).isEqualTo(9);
        verify(vehicleRepository).save(locked);
    }

    @Test
    @DisplayName("purchase: zero-quantity vehicle → throws InsufficientStockException, no save")
    void purchase_zeroQuantity_throwsInsufficientStockException() {
        Vehicle outOfStock = Vehicle.builder()
                .id(1L)
                .make("Toyota")
                .model("Camry")
                .category("Sedan")
                .price(new BigDecimal("25000.00"))
                .quantity(0)
                .build();

        when(vehicleRepository.findByIdWithLock(1L)).thenReturn(Optional.of(outOfStock));

        assertThatThrownBy(() -> vehicleService.purchase(1L))
                .isInstanceOf(InsufficientStockException.class);

        verify(vehicleRepository, never()).save(any(Vehicle.class));
    }

    // restock
    @Test
    @DisplayName("restock: valid amount → quantity increases by exactly the given amount")
    void restock_validAmount_increasesQuantityByGivenAmount() {
        Vehicle locked = savedSedan(); // quantity = 10
        when(vehicleRepository.findByIdWithLock(1L)).thenReturn(Optional.of(locked));
        when(vehicleRepository.save(locked)).thenReturn(locked);

        RestockRequest restockRequest = new RestockRequest();
        restockRequest.setQuantity(5);

        VehicleResponse response = vehicleService.restock(1L, restockRequest);

        assertThat(response.getQuantity()).isEqualTo(15);
        verify(vehicleRepository).save(locked);
    }
}
