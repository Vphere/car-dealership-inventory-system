package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.RestockRequest;
import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;

import java.math.BigDecimal;
import java.util.List;

public interface VehicleService {

    VehicleResponse create(VehicleRequest request);

    List<VehicleResponse> getAll();

    List<VehicleResponse> search(String make, String model, String category,
                                 BigDecimal minPrice, BigDecimal maxPrice);

    VehicleResponse update(Long id, VehicleRequest request);

    void delete(Long id);

    VehicleResponse purchase(Long id);

    VehicleResponse restock(Long id, RestockRequest request);
}
