package com.exam.template.repository;

import com.exam.template.entity.Product;
import com.exam.template.entity.StockRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRecordRepository extends JpaRepository<StockRecord, Long> {

    /**
     * Calculates available stock for a given product.
     * IN/INIT operations add stock, OUT operations subtract.
     * MODIFY: Adjust this query if your exam uses different operation types.
     */
    @Query("SELECT COALESCE(SUM(CASE WHEN s.operation IN ('IN', 'INIT') THEN s.quantity " +
           "WHEN s.operation = 'OUT' THEN -s.quantity ELSE 0 END), 0) " +
           "FROM StockRecord s WHERE s.product = :product")
    int calculateAvailableStock(@Param("product") Product product);
}
