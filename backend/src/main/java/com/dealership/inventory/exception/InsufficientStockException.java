package com.dealership.inventory.exception;

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(Long vehicleId, int requested, int available) {
        super("Insufficient stock for vehicle id " + vehicleId
              + ": requested " + requested + ", available " + available);
    }
}
