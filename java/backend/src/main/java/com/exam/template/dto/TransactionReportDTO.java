package com.exam.template.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for the report table – flattened view of Transaction + User + Product.
 * RENAME fields to match your exam's report columns.
 */
public class TransactionReportDTO {

    private Long transactionId;
    private String customerName;
    private LocalDateTime date;
    private String productCode;
    private String productName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal total;
    private String status;

    public TransactionReportDTO() {}

    public TransactionReportDTO(Long transactionId, String customerName, LocalDateTime date,
                                 String productCode, String productName, Integer quantity,
                                 BigDecimal unitPrice, BigDecimal total, String status) {
        this.transactionId = transactionId;
        this.customerName = customerName;
        this.date = date;
        this.productCode = productCode;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.total = total;
        this.status = status;
    }

    // ---- Getters & Setters ----

    public Long getTransactionId() { return transactionId; }
    public void setTransactionId(Long transactionId) { this.transactionId = transactionId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
