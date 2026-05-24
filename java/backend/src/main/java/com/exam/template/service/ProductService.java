package com.exam.template.service;

import com.exam.template.dto.ProductRequest;
import com.exam.template.entity.Product;
import com.exam.template.exception.DuplicateResourceException;
import com.exam.template.exception.ResourceNotFoundException;
import com.exam.template.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service for core entity CRUD operations.
 * RENAME: ParkingService, EquipmentService, LaptopService, etc.
 */
@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public Product findByCode(String code) {
        return productRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with code: " + code));
    }

    public Product create(ProductRequest request) {
        if (productRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Product with code '" + request.getCode() + "' already exists");
        }

        Product product = new Product();
        product.setCode(request.getCode());
        product.setName(request.getName());
        product.setType(request.getType());
        product.setPrice(request.getPrice());
        product.setInDate(request.getInDate());
        product.setImageUrl(request.getImageUrl());

        Product saved = productRepository.save(product);
        log.info("Product created: {}", saved.getCode());
        return saved;
    }

    public Product update(String code, ProductRequest request) {
        Product product = findByCode(code);
        product.setName(request.getName());
        product.setType(request.getType());
        product.setPrice(request.getPrice());
        product.setInDate(request.getInDate());
        product.setImageUrl(request.getImageUrl());

        Product updated = productRepository.save(product);
        log.info("Product updated: {}", updated.getCode());
        return updated;
    }

    public void delete(String code) {
        Product product = findByCode(code);
        productRepository.delete(product);
        log.info("Product deleted: {}", code);
    }
}
