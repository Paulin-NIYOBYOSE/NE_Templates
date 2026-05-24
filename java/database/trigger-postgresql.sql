-- ============================================================
-- PostgreSQL Trigger: Auto-calculate total BEFORE INSERT on transactions
-- RENAME: Change table/column names to match your exam
-- ============================================================

CREATE OR REPLACE FUNCTION calculate_transaction_total()
RETURNS TRIGGER AS $$
DECLARE
    product_price DECIMAL(12,2);
BEGIN
    -- Fetch the current price from the products table
    SELECT price INTO product_price
    FROM products
    WHERE id = NEW.product_id;

    -- Set the unit_price to the product's current price
    NEW.unit_price := product_price;

    -- Calculate total = unit_price * quantity
    NEW.total := product_price * NEW.quantity;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_transaction_insert
BEFORE INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION calculate_transaction_total();

-- ============================================================
-- OPTIONAL: Trigger to auto-deduct stock on transaction insert
-- Uncomment if your exam requires automatic stock deduction
-- ============================================================
/*
CREATE OR REPLACE FUNCTION deduct_stock_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO stock_records (product_id, quantity, operation, date, created_at, updated_at)
    VALUES (NEW.product_id, NEW.quantity, 'OUT', NOW(), NOW(), NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_transaction_insert_stock
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION deduct_stock_on_transaction();
*/
