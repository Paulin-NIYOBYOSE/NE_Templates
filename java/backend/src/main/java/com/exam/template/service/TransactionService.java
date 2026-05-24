package com.exam.template.service;

import com.exam.template.dto.CheckoutItemRequest;
import com.exam.template.dto.CheckoutRequest;
import com.exam.template.dto.TransactionReportDTO;
import com.exam.template.entity.Product;
import com.exam.template.entity.StockRecord;
import com.exam.template.entity.Transaction;
import com.exam.template.entity.User;
import com.exam.template.exception.InsufficientStockException;
import com.exam.template.exception.ResourceNotFoundException;
import com.exam.template.repository.ProductRepository;
import com.exam.template.repository.StockRecordRepository;
import com.exam.template.repository.TransactionRepository;
import com.exam.template.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Transaction/checkout service – the main business logic.
 * MODIFY:
 *   - Adjust total calculation if needed (e.g., add tax, discount).
 *   - Enable/disable stock validation and stock update as per exam requirements.
 *   - Change status values as needed.
 */
@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final StockRecordRepository stockRecordRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              ProductRepository productRepository,
                              UserRepository userRepository,
                              StockRecordRepository stockRecordRepository) {
        this.transactionRepository = transactionRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.stockRecordRepository = stockRecordRepository;
    }

    /**
     * Process checkout – creates transactions for each item in the cart.
     * @param email  authenticated user's email
     * @param request checkout request with list of items
     * @return list of created transactions
     */
    @Transactional
    public List<Transaction> checkout(String email, CheckoutRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<Transaction> transactions = new ArrayList<>();

        for (CheckoutItemRequest item : request.getItems()) {
            Product product = productRepository.findByCode(item.getProductCode())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found: " + item.getProductCode()));

            // ============================================================
            // OPTIONAL: Validate stock availability
            // Uncomment the following block if your exam requires stock validation
            // ============================================================
            /*
            int available = stockRecordRepository.calculateAvailableStock(product);
            if (available < item.getQuantity()) {
                throw new InsufficientStockException(
                        "Insufficient stock for " + product.getName()
                        + ". Available: " + available + ", Requested: " + item.getQuantity());
            }
            */

            // Snapshot the price at transaction time
            BigDecimal unitPrice = product.getPrice();
            // Calculate total = unitPrice * quantity (Java fallback for DB trigger)
            BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            Transaction transaction = new Transaction();
            transaction.setUser(user);
            transaction.setProduct(product);
            transaction.setQuantity(item.getQuantity());
            transaction.setUnitPrice(unitPrice);
            transaction.setTotal(total);
            transaction.setTransactionDate(LocalDateTime.now());
            transaction.setStatus("COMPLETED");

            transactions.add(transactionRepository.save(transaction));

            // ============================================================
            // OPTIONAL: Update stock (subtract quantity)
            // Uncomment if your exam requires stock deduction on checkout
            // ============================================================
            /*
            StockRecord outRecord = new StockRecord();
            outRecord.setProduct(product);
            outRecord.setQuantity(item.getQuantity());
            outRecord.setOperation("OUT");
            outRecord.setDate(LocalDateTime.now());
            stockRecordRepository.save(outRecord);
            */

            log.info("Transaction created: user={}, product={}, qty={}, total={}",
                    email, product.getCode(), item.getQuantity(), total);
        }

        return transactions;
    }

    /**
     * Generate report – returns flattened transaction data with optional date filtering.
     */
    public Page<TransactionReportDTO> getReport(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByDateRange(startDate, endDate, pageable);
        return transactions.map(this::toReportDTO);
    }

    /**
     * Generate report for a specific user.
     */
    public Page<TransactionReportDTO> getUserReport(String email, LocalDateTime startDate,
                                                     LocalDateTime endDate, Pageable pageable) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
        Page<Transaction> transactions = transactionRepository.findByUserAndDateRange(user, startDate, endDate, pageable);
        return transactions.map(this::toReportDTO);
    }

    private TransactionReportDTO toReportDTO(Transaction t) {
        return new TransactionReportDTO(
                t.getId(),
                t.getUser().getFullName(),
                t.getTransactionDate(),
                t.getProduct().getCode(),
                t.getProduct().getName(),
                t.getQuantity(),
                t.getUnitPrice(),
                t.getTotal(),
                t.getStatus()
        );
    }
}
