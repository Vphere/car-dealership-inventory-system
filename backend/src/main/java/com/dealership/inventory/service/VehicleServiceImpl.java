package com.dealership.inventory.service;

import com.dealership.inventory.domain.entity.Vehicle;
import com.dealership.inventory.domain.repository.VehicleRepository;
import com.dealership.inventory.dto.request.RestockRequest;
import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.exception.InsufficientStockException;
import com.dealership.inventory.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    // write operations 

    @Override
    @Transactional
    public VehicleResponse create(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
                .make(request.getMake())
                .model(request.getModel())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .build();

        return toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));

        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setCategory(request.getCategory());
        vehicle.setPrice(request.getPrice());
        vehicle.setQuantity(request.getQuantity());

        return toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", id);
        }
        vehicleRepository.deleteById(id);
    }

    /**
     * Decrements quantity by 1.
     * Uses a PESSIMISTIC_WRITE lock via findByIdWithLock so that concurrent
     * purchase requests for the same vehicle are serialised at the DB level.
     */
    @Override
    @Transactional
    public VehicleResponse purchase(Long id) {
        Vehicle vehicle = findLockedOrThrow(id);

        if (vehicle.getQuantity() <= 0) {
            throw new InsufficientStockException(id, 1, vehicle.getQuantity());
        }

        vehicle.setQuantity(vehicle.getQuantity() - 1);
        return toResponse(vehicleRepository.save(vehicle));
    }

    /**
     * Increases quantity by the amount specified in the request.
     * Also uses the PESSIMISTIC_WRITE lock — a concurrent restock and purchase
     * against the same row must not interleave their reads and writes.
     */
    @Override
    @Transactional
    public VehicleResponse restock(Long id, RestockRequest request) {
        Vehicle vehicle = findLockedOrThrow(id);
        vehicle.setQuantity(vehicle.getQuantity() + request.getQuantity());
        return toResponse(vehicleRepository.save(vehicle));
    }

    // read operations 

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getAll() {
        return vehicleRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> search(String make, String model, String category,
                                        BigDecimal minPrice, BigDecimal maxPrice) {
        return vehicleRepository.search(make, model, category, minPrice, maxPrice)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Refactor: both purchase() and restock() need the same "fetch with lock
     * or throw" logic. Extracting it here keeps those methods focused on their
     * own business rules and avoids duplicating the ResourceNotFoundException
     * message format.
     */
    private Vehicle findLockedOrThrow(Long id) {
        return vehicleRepository.findByIdWithLock(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .make(vehicle.getMake())
                .model(vehicle.getModel())
                .category(vehicle.getCategory())
                .price(vehicle.getPrice())
                .quantity(vehicle.getQuantity())
                .build();
    }
}
