package com.dealership.inventory.domain.repository;

import com.dealership.inventory.domain.entity.Vehicle;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    /**
     * Fetches a single vehicle by id with a PESSIMISTIC_WRITE lock.
     * Used in purchase and restock flows to prevent concurrent quantity conflicts.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    Optional<Vehicle> findByIdWithLock(@Param("id") Long id);

    /**
     * Searches vehicles with optional nullable filters.
     * Null parameters are treated as "match all" for that field.
     */
    @Query("""
            SELECT v FROM Vehicle v
            WHERE (:make IS NULL OR LOWER(v.make) = LOWER(:make))
              AND (:model IS NULL OR LOWER(v.model) = LOWER(:model))
              AND (:category IS NULL OR LOWER(v.category) = LOWER(:category))
              AND (:minPrice IS NULL OR v.price >= :minPrice)
              AND (:maxPrice IS NULL OR v.price <= :maxPrice)
            """)
    List<Vehicle> search(
            @Param("make") String make,
            @Param("model") String model,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );
}
