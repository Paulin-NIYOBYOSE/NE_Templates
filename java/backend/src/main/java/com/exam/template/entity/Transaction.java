package com.exam.template.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction entity – represents a purchase, booking, assignment, rental, etc.
 * RENAME: Purchased, Booking, Assignment, Rental, Order, etc.
 * MODIFY:
 *   - total calculation logic (in TransactionService)
 *   - status values: "PENDING", "COMPLETED", "CANCELLED", "ACTIVE", "RETURNED"
 *   - Add extra fields: returnDate, notes, etc.
 */
@Entity
@Table(name = "transactions")
public class Transaction extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    /** Price copied from Product at transaction time – immutable snapshot */
    @NotNull
    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    /** total = unitPrice * quantity (can be set by DB trigger or Java code) */
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal total;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(nullable = false)
    private String status = "PENDING";

    // ---- Constructors ----

    public Transaction() {}

    public Transaction(User user, Product product, Integer quantity,
                       BigDecimal unitPrice, BigDecimal total,
                       LocalDateTime transactionDate, String status) {
        this.user = user;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = total;
        this.transactionDate = transactionDate;
        this.status = status;
    }

    // ---- Getters & Setters ----

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
