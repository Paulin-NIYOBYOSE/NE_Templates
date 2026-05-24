-- ============================================================
-- MySQL Trigger: Auto-calculate total BEFORE INSERT on transactions
-- RENAME: Change table/column names to match your exam
--
-- This trigger sets:
--   total = (SELECT price FROM products WHERE id = NEW.product_id) * NEW.quantity
--
-- NOTE: The Java code already calculates total as a fallback.
--       This trigger provides a database-level guarantee.
-- ============================================================

DELIMITER //

CREATE TRIGGER before_transaction_insert
BEFORE INSERT ON transactions
FOR EACH ROW
BEGIN
    DECLARE product_price DECIMAL(12,2);

    -- Fetch the current price from the products table
    SELECT price INTO product_price
    FROM products
    WHERE id = NEW.product_id;

    -- Set the unit_price to the product's current price
    SET NEW.unit_price = product_price;

    -- Calculate total = unit_price * quantity
    SET NEW.total = product_price * NEW.quantity;
END //

DELIMITER ;

-- ============================================================
-- OPTIONAL: Trigger to auto-deduct stock on transaction insert
-- Uncomment if your exam requires automatic stock deduction
-- ============================================================
/*
DELIMITER //

CREATE TRIGGER after_transaction_insert_stock
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    INSERT INTO stock_records (product_id, quantity, operation, date, created_at, updated_at)
    VALUES (NEW.product_id, NEW.quantity, 'OUT', NOW(), NOW(), NOW());
END //

DELIMITER ;
*/
