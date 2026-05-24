package com.exam.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO for adding a stock/quantity record.
 * RENAME: AvailableSpacesRequest, InventoryRequest, etc.
 */
public class StockRequest {

    @NotBlank(message = "Product code is required")
    private String productCode;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotBlank(message = "Operation is required (IN, OUT, INIT)")
    private String operation;

    // ---- Getters & Setters ----

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getOperation() { return operation; }
    public void setOperation(String operation) { this.operation = operation; }
}
