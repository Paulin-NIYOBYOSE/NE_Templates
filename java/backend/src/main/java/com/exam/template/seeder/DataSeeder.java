package com.exam.template.seeder;

import com.exam.template.entity.Product;
import com.exam.template.entity.StockRecord;
import com.exam.template.entity.User;
import com.exam.template.repository.ProductRepository;
import com.exam.template.repository.StockRecordRepository;
import com.exam.template.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Inserts sample data on application startup (only if DB is empty).
 * MODIFY: Change the sample data to match your exam scenario.
 *   - Rename products to parkings, equipment, laptops, etc.
 *   - Adjust prices, types, codes, etc.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final StockRecordRepository stockRecordRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      ProductRepository productRepository,
                      StockRecordRepository stockRecordRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.stockRecordRepository = stockRecordRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProducts();
        log.info("=== Data seeding complete ===");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already seeded, skipping...");
            return;
        }

        // Admin user
        User admin = new User();
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setPhone("+250780000000");
        admin.setRole("ROLE_ADMIN");
        userRepository.save(admin);

        // Regular user
        User user = new User();
        user.setEmail("user@example.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setPhone("+250781111111");
        user.setRole("ROLE_USER");
        userRepository.save(user);

        log.info("Seeded 2 users (admin@example.com / admin123, user@example.com / user123)");
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            log.info("Products already seeded, skipping...");
            return;
        }

        // ============================================================
        // MODIFY: Change these to match your exam's core entities
        // Example for shopping: products with codes, names, prices
        // Example for parking: parking lots with codes, names, hourly fees
        // ============================================================
        Object[][] data = {
                {"PRD-001", "Laptop HP ProBook", "ELECTRONICS", new BigDecimal("850.00")},
                {"PRD-002", "Wireless Mouse", "ACCESSORIES", new BigDecimal("25.00")},
                {"PRD-003", "USB-C Hub Adapter", "ACCESSORIES", new BigDecimal("45.00")},
                {"PRD-004", "Monitor 27\" 4K", "ELECTRONICS", new BigDecimal("420.00")},
                {"PRD-005", "Mechanical Keyboard", "ACCESSORIES", new BigDecimal("75.00")},
        };

        for (Object[] d : data) {
            Product product = new Product();
            product.setCode((String) d[0]);
            product.setName((String) d[1]);
            product.setType((String) d[2]);
            product.setPrice((BigDecimal) d[3]);
            product.setInDate(LocalDate.now());
            productRepository.save(product);

            // Add initial stock record (quantity = 100)
            StockRecord stock = new StockRecord();
            stock.setProduct(product);
            stock.setQuantity(100);
            stock.setOperation("INIT");
            stock.setDate(LocalDateTime.now());
            stockRecordRepository.save(stock);
        }

        log.info("Seeded {} products with initial stock (100 each)", data.length);
    }
}
