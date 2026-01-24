package com.omnilogistics.core.repository;

import com.omnilogistics.core.entity.Truck;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TruckRepository extends JpaRepository<Truck, Long> {
    Optional<Truck> findByLicensePlate(String licensePlate);
    List<Truck> findByStatus(Truck.TruckStatus status);
}
