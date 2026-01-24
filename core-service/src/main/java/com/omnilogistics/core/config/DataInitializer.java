package com.omnilogistics.core.config;

import com.omnilogistics.core.entity.User;
import com.omnilogistics.core.entity.Order;
import com.omnilogistics.core.entity.Truck;
import com.omnilogistics.core.repository.UserRepository;
import com.omnilogistics.core.repository.OrderRepository;
import com.omnilogistics.core.repository.TruckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default users if none exist
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setEmail("admin@omnilogistics.ke");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("Admin User");
            admin.setPhone("+254700000001");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);

            User manager = new User();
            manager.setEmail("manager@omnilogistics.ke");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setName("Fleet Manager");
            manager.setPhone("+254700000002");
            manager.setRole(User.Role.MANAGER);
            userRepository.save(manager);

            User driver = new User();
            driver.setEmail("driver@omnilogistics.ke");
            driver.setPassword(passwordEncoder.encode("driver123"));
            driver.setName("John Driver");
            driver.setPhone("+254700000003");
            driver.setRole(User.Role.DRIVER);
            userRepository.save(driver);

            System.out.println("✅ Default users created");
        }

        // Create sample trucks
        if (truckRepository.count() == 0) {
            createTruck("KBX-001", "Isuzu FRR", "James Mwangi", 5000, -1.2921, 36.8219, "Nairobi");
            createTruck("KCA-054", "Mercedes Atego", "Peter Ochieng", 8000, -4.0435, 39.6682, "Mombasa");
            createTruck("KAK-123", "Mitsubishi Canter", "David Kipchoge", 3500, -0.0917, 34.7680, "Kisumu");
            System.out.println("✅ Sample trucks created");
        }

        // Create sample orders
        if (orderRepository.count() == 0) {
            createOrder("ORD-KE-7821", "Nairobi", "Mombasa", "Nakumatt Ltd", "+254722111222", 
                Order.OrderStatus.IN_TRANSIT, new BigDecimal("425000"), "James Mwangi", "KBX-001");
            createOrder("ORD-KE-8934", "Mombasa", "Kisumu", "Tuskys Supermarket", "+254722333444",
                Order.OrderStatus.PENDING, new BigDecimal("318000"), null, null);
            createOrder("ORD-KE-6543", "Kisumu", "Nairobi", "Naivas", "+254722555666",
                Order.OrderStatus.DELIVERED, new BigDecimal("542000"), "Peter Ochieng", "KCA-054");
            System.out.println("✅ Sample orders created");
        }
    }

    private void createTruck(String plate, String model, String driver, int capacity, 
                             double lat, double lng, String location) {
        Truck truck = new Truck();
        truck.setLicensePlate(plate);
        truck.setModel(model);
        truck.setDriverName(driver);
        truck.setCapacity(capacity);
        truck.setLatitude(lat);
        truck.setLongitude(lng);
        truck.setCurrentLocation(location);
        truck.setStatus(Truck.TruckStatus.AVAILABLE);
        truckRepository.save(truck);
    }

    private void createOrder(String orderNum, String origin, String dest, String client, 
                             String phone, Order.OrderStatus status, BigDecimal amount,
                             String driver, String truck) {
        Order order = new Order();
        order.setOrderNumber(orderNum);
        order.setOrigin(origin);
        order.setDestination(dest);
        order.setClientName(client);
        order.setClientPhone(phone);
        order.setStatus(status);
        order.setAmount(amount);
        order.setAssignedDriver(driver);
        order.setTruckPlate(truck);
        orderRepository.save(order);
    }
}
