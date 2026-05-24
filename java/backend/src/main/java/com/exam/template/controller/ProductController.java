package com.exam.template.controller;

import com.exam.template.dto.ProductRequest;
import com.exam.template.entity.Product;
import com.exam.template.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * CRUD controller for the core entity.
 * RENAME: ParkingController, EquipmentController, LaptopController, etc.
 * RENAME endpoints: /api/products → /api/parkings, /api/equipment, etc.
 */
@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Core entity management (rename to match exam)")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get paginated list of products (public)")
    public ResponseEntity<Page<Product>> getAll(
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(productService.findAll(pageable));
    }

    @GetMapping("/{code}")
    @Operation(summary = "Get product by code (public)")
    public ResponseEntity<Product> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(productService.findByCode(code));
    }

    @PostMapping
    @Operation(summary = "Create a new product (Admin only – use via Swagger/Postman)")
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        Product created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{code}")
    @Operation(summary = "Update a product (Admin only)")
    public ResponseEntity<Product> update(@PathVariable String code,
                                          @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.update(code, request));
    }

    @DeleteMapping("/{code}")
    @Operation(summary = "Delete a product (Admin only)")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        productService.delete(code);
        return ResponseEntity.noContent().build();
    }
}
