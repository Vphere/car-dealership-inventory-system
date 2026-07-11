package com.dealership.inventory.controller;

import com.dealership.inventory.dto.request.RestockRequest;
import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    // read operations

    @GetMapping
    public List<VehicleResponse> getAll() {
        return vehicleService.getAll();
    }

    @GetMapping("/search")
    public List<VehicleResponse> search(
            @RequestParam(required = false) String make,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return vehicleService.search(make, model, category, minPrice, maxPrice);
    }

    // write operations

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleResponse create(@Valid @RequestBody VehicleRequest request) {
        return vehicleService.create(request);
    }

    @PutMapping("/{id}")
    public VehicleResponse update(
            @PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return vehicleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vehicleService.delete(id);
    }

    // inventory operations

    @PostMapping("/{id}/purchase")
    public VehicleResponse purchase(@PathVariable Long id) {
        return vehicleService.purchase(id);
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public VehicleResponse restock(
            @PathVariable Long id, @Valid @RequestBody RestockRequest request) {
        return vehicleService.restock(id, request);
    }
}
