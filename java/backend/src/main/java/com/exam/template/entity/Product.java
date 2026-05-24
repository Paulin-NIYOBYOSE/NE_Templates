package com.exam.template.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Core domain entity – represents the main "thing" in the exam.
 * RENAME: Change to Parking, Equipment, Laptop, Car, etc.
 * MODIFY fields:
 *   - code   → parkingCode, equipmentCode, laptopSerialNumber, etc.
 *   - name   → parkingName, equipmentName, laptopModel, etc.
 *   - type   → parkingType (COVERED/UNCOVERED), category, brand, etc.
 *   - price  → hourlyFee, rentalPrice, purchasePrice, etc.
 *   - inDate → registrationDate, arrivalDate, purchaseDate, etc.
 */
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    @NotBlank
    @Column(unique = true, nullable = false)
    private String code;

    @NotBlank
    @Column(nullable = false)
    private String name;

    /** Type/category – can be a simple String or backed by an enum */
    private String type;

    @NotNull
    @Positive
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    /** Date the item was registered/added to inventory */
    @Column(name = "in_date")
    private LocalDate inDate;

    /** Optional image URL */
    @Column(name = "image_url")
    private String imageUrl;

    // ---- Constructors ----

    public Product() {}

    public Product(String code, String name, String type, BigDecimal price, LocalDate inDate, String imageUrl) {
        this.code = code;
        this.name = name;
        this.type = type;
        this.price = price;
        this.inDate = inDate;
        this.imageUrl = imageUrl;
    }

    // ---- Getters & Setters ----

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public LocalDate getInDate() {
        return inDate;
    }

    public void setInDate(LocalDate inDate) {
        this.inDate = inDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
