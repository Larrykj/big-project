package com.omnilogistics.core;

import com.omnilogistics.core.entity.User;
import com.omnilogistics.core.entity.Order;
import com.omnilogistics.core.entity.Truck;
import com.omnilogistics.core.repository.UserRepository;
import com.omnilogistics.core.repository.OrderRepository;
import com.omnilogistics.core.repository.TruckRepository;
import com.omnilogistics.core.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
class CoreServiceApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private TruckRepository truckRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void contextLoads() {
        assertNotNull(mockMvc);
        assertNotNull(userRepository);
        assertNotNull(orderRepository);
        assertNotNull(truckRepository);
    }

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/"))
            .andExpect(status().isOk())
            .andExpect(content().string(org.hamcrest.Matchers.containsString("OmniLogistics")));
    }

    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"invalid@test.com\",\"password\":\"wrongpassword\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void testUserEntityCreation() {
        User user = new User();
        user.setEmail("test@omnilogistics.ke");
        user.setPassword(passwordEncoder.encode("testpass"));
        user.setName("Test User");
        user.setRole(User.Role.CUSTOMER);

        assertNotNull(user.getEmail());
        assertEquals("test@omnilogistics.ke", user.getEmail());
        assertEquals("Test User", user.getName());
        assertEquals(User.Role.CUSTOMER, user.getRole());
    }

    @Test
    void testOrderEntityCreation() {
        Order order = new Order();
        order.setOrderNumber("ORD-TEST-001");
        order.setOrigin("Nairobi");
        order.setDestination("Mombasa");
        order.setAmount(new BigDecimal("50000"));
        order.setStatus(Order.OrderStatus.PENDING);

        assertEquals("ORD-TEST-001", order.getOrderNumber());
        assertEquals("Nairobi", order.getOrigin());
        assertEquals("Mombasa", order.getDestination());
        assertEquals(Order.OrderStatus.PENDING, order.getStatus());
    }

    @Test
    void testTruckEntityCreation() {
        Truck truck = new Truck();
        truck.setLicensePlate("KBX-TEST");
        truck.setModel("Isuzu FRR");
        truck.setCapacity(5000);
        truck.setStatus(Truck.TruckStatus.AVAILABLE);

        assertEquals("KBX-TEST", truck.getLicensePlate());
        assertEquals("Isuzu FRR", truck.getModel());
        assertEquals(5000, truck.getCapacity());
        assertEquals(Truck.TruckStatus.AVAILABLE, truck.getStatus());
    }

    @Test
    void testJwtTokenGeneration() {
        String token = jwtUtil.generateToken("test@example.com", "ADMIN");
        assertNotNull(token);
        assertTrue(token.length() > 50);
        
        String username = jwtUtil.extractUsername(token);
        assertEquals("test@example.com", username);
        
        assertTrue(jwtUtil.validateToken(token));
    }

    @Test
    void testOrderStatusProgression() {
        Order order = new Order();
        order.setStatus(Order.OrderStatus.PENDING);
        assertEquals(Order.OrderStatus.PENDING, order.getStatus());

        order.setStatus(Order.OrderStatus.CONFIRMED);
        assertEquals(Order.OrderStatus.CONFIRMED, order.getStatus());

        order.setStatus(Order.OrderStatus.IN_TRANSIT);
        assertEquals(Order.OrderStatus.IN_TRANSIT, order.getStatus());

        order.setStatus(Order.OrderStatus.DELIVERED);
        assertEquals(Order.OrderStatus.DELIVERED, order.getStatus());
    }

    @Test
    void testUserRoles() {
        assertEquals(4, User.Role.values().length);
        assertArrayEquals(
            new User.Role[]{User.Role.ADMIN, User.Role.MANAGER, User.Role.DRIVER, User.Role.CUSTOMER},
            User.Role.values()
        );
    }

    @Test
    void testTruckStatuses() {
        assertEquals(4, Truck.TruckStatus.values().length);
        assertArrayEquals(
            new Truck.TruckStatus[]{Truck.TruckStatus.AVAILABLE, Truck.TruckStatus.ON_ROUTE, 
                                    Truck.TruckStatus.MAINTENANCE, Truck.TruckStatus.OFFLINE},
            Truck.TruckStatus.values()
        );
    }
}
