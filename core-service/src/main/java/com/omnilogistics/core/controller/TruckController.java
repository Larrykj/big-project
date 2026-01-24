package com.omnilogistics.core.controller;

import com.omnilogistics.core.entity.Truck;
import com.omnilogistics.core.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trucks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TruckController {

    @Autowired
    private TruckRepository truckRepository;

    @GetMapping
    public List<Truck> getAllTrucks() {
        return truckRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTruck(@PathVariable Long id) {
        return truckRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public List<Truck> getAvailableTrucks() {
        return truckRepository.findByStatus(Truck.TruckStatus.AVAILABLE);
    }

    @PostMapping
    public ResponseEntity<?> createTruck(@RequestBody Truck truck) {
        truck.setLastUpdate(LocalDateTime.now());
        Truck saved = truckRepository.save(truck);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTruck(@PathVariable Long id, @RequestBody Truck truckDetails) {
        return truckRepository.findById(id)
            .map(truck -> {
                truck.setLicensePlate(truckDetails.getLicensePlate());
                truck.setModel(truckDetails.getModel());
                truck.setDriverName(truckDetails.getDriverName());
                truck.setCapacity(truckDetails.getCapacity());
                truck.setStatus(truckDetails.getStatus());
                truck.setLastUpdate(LocalDateTime.now());
                return ResponseEntity.ok(truckRepository.save(truck));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<?> updateTruckLocation(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return truckRepository.findById(id)
            .map(truck -> {
                truck.setLatitude((Double) body.get("latitude"));
                truck.setLongitude((Double) body.get("longitude"));
                truck.setCurrentLocation((String) body.get("location"));
                truck.setLastUpdate(LocalDateTime.now());
                return ResponseEntity.ok(truckRepository.save(truck));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTruck(@PathVariable Long id) {
        return truckRepository.findById(id)
            .map(truck -> {
                truckRepository.delete(truck);
                return ResponseEntity.ok(Map.of("message", "Truck deleted"));
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
