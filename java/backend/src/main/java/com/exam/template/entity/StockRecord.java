package com.exam.template.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

/**
 * Tracks mutable quantities for the core entity.
 * RENAME: AvailableSpaces, InventoryRecord, StockMovement, etc.
 * MODIFY:
 *   - operation values: "IN", "OUT", "INIT", "RESERVED", "RELEASED"
 *   - Add additional fields if needed (e.g., reason, performedBy)
 */
@Entity
@Table(name = "stock_records")
public class StockRecord extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Integer quantity;

    /** Operation type: "IN", "OUT", "INIT" */
    @Column(nullable = false)
    private String operation;

    @Column(nullable = false)
    private LocalDateTime date;

    // ---- Constructors ----

    public StockRecord() {}

    public StockRecord(Product product, Integer quantity, String operation, LocalDateTime date) {
        this.product = product;
        this.quantity = quantity;
        this.operation = operation;
        this.date = date;
    }

    // ---- Getters & Setters ----

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

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
