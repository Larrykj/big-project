package com.omnilogistics.core.controller;

import com.omnilogistics.core.entity.Order;
import com.omnilogistics.core.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<?> trackOrder(@PathVariable String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
            .map(order -> ResponseEntity.ok(Map.of(
                "orderNumber", order.getOrderNumber(),
                "status", order.getStatus().name(),
                "origin", order.getOrigin(),
                "destination", order.getDestination(),
                "driver", order.getAssignedDriver() != null ? order.getAssignedDriver() : "Unassigned",
                "truck", order.getTruckPlate() != null ? order.getTruckPlate() : "Unassigned",
                "progress", calculateProgress(order.getStatus()),
                "createdAt", order.getCreatedAt(),
                "updatedAt", order.getUpdatedAt()
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        order.setOrderNumber("ORD-KE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Order orderDetails) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setOrigin(orderDetails.getOrigin());
                order.setDestination(orderDetails.getDestination());
                order.setClientName(orderDetails.getClientName());
                order.setClientPhone(orderDetails.getClientPhone());
                order.setAmount(orderDetails.getAmount());
                order.setAssignedDriver(orderDetails.getAssignedDriver());
                order.setTruckPlate(orderDetails.getTruckPlate());
                order.setUpdatedAt(LocalDateTime.now());
                return ResponseEntity.ok(orderRepository.save(order));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setStatus(Order.OrderStatus.valueOf(body.get("status")));
                order.setUpdatedAt(LocalDateTime.now());
                if (order.getStatus() == Order.OrderStatus.DELIVERED) {
                    order.setDeliveredAt(LocalDateTime.now());
                }
                return ResponseEntity.ok(orderRepository.save(order));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
            .map(order -> {
                orderRepository.delete(order);
                return ResponseEntity.ok(Map.of("message", "Order deleted"));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private int calculateProgress(Order.OrderStatus status) {
        return switch (status) {
            case PENDING -> 10;
            case CONFIRMED -> 25;
            case IN_TRANSIT -> 60;
            case DELIVERED -> 100;
            case CANCELLED -> 0;
        };
    }
}
