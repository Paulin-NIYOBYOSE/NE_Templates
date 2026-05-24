package com.exam.template.service;

import com.exam.template.dto.StockRequest;
import com.exam.template.entity.Product;
import com.exam.template.entity.StockRecord;
import com.exam.template.repository.ProductRepository;
import com.exam.template.repository.StockRecordRepository;
import com.exam.template.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for managing stock/quantity records.
 * RENAME: AvailableSpacesService, InventoryService, etc.
 */
@Service
public class StockService {

    private static final Logger log = LoggerFactory.getLogger(StockService.class);

    private final StockRecordRepository stockRecordRepository;
    private final ProductRepository productRepository;

    public StockService(StockRecordRepository stockRecordRepository, ProductRepository productRepository) {
        this.stockRecordRepository = stockRecordRepository;
        this.productRepository = productRepository;
    }

    public StockRecord addStockRecord(StockRequest request) {
        Product product = productRepository.findByCode(request.getProductCode())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Product not found with code: " + request.getProductCode()));

        StockRecord record = new StockRecord();
        record.setProduct(product);
        record.setQuantity(request.getQuantity());
        record.setOperation(request.getOperation().toUpperCase());
        record.setDate(LocalDateTime.now());

        StockRecord saved = stockRecordRepository.save(record);
        log.info("Stock record added: product={}, qty={}, op={}",
                product.getCode(), request.getQuantity(), request.getOperation());
        return saved;
    }

    public int getAvailableStock(Product product) {
        return stockRecordRepository.calculateAvailableStock(product);
    }
}
