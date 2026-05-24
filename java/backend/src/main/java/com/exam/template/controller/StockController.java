package com.exam.template.controller;

import com.exam.template.dto.StockRequest;
import com.exam.template.entity.StockRecord;
import com.exam.template.service.StockService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Stock/Quantity management – admin only, used via Swagger/Postman.
 * RENAME: AvailableSpacesController, InventoryController, etc.
 */
@RestController
@RequestMapping("/api/quantities")
@Tag(name = "Stock/Quantities", description = "Manage stock records (Admin only – use via Swagger/Postman)")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    @Operation(summary = "Add a stock record (Admin only)")
    public ResponseEntity<StockRecord> addStock(@Valid @RequestBody StockRequest request) {
        StockRecord record = stockService.addStockRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(record);
    }
}
