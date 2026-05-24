package com.exam.template.controller;

import com.exam.template.dto.CheckoutRequest;
import com.exam.template.dto.TransactionReportDTO;
import com.exam.template.entity.Transaction;
import com.exam.template.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Transaction/Checkout controller.
 * RENAME: PurchaseController, BookingController, AssignmentController, etc.
 */
@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "Checkout and report endpoints (authenticated)")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/checkout")
    @Operation(summary = "Checkout cart items – creates transactions for each item")
    public ResponseEntity<List<Transaction>> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequest request) {
        String email = authentication.getName();
        List<Transaction> transactions = transactionService.checkout(email, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(transactions);
    }

    @GetMapping("/report")
    @Operation(summary = "Get transaction report with optional date range filtering")
    public ResponseEntity<Page<TransactionReportDTO>> getReport(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return ResponseEntity.ok(transactionService.getReport(startDate, endDate, pageable));
    }

    @GetMapping("/my-report")
    @Operation(summary = "Get current user's transaction report")
    public ResponseEntity<Page<TransactionReportDTO>> getMyReport(
            Authentication authentication,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        String email = authentication.getName();
        return ResponseEntity.ok(transactionService.getUserReport(email, startDate, endDate, pageable));
    }
}
