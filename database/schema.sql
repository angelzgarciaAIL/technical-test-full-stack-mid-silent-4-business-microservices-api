-- Database schema for Microservices Project
-- Created: 2024-12-05

-- Create database
CREATE DATABASE IF NOT EXISTS microservices_db;
USE microservices_db;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS products;

-- Create products table with soft delete support
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    country_code CHAR(2) NOT NULL,
    load_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_country_code (country_code),
    INDEX idx_deleted_at (deleted_at),
    INDEX idx_sku (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO products (name, sku, country_code, load_date) VALUES
('iPhone 15', 'CTUS1', 'US', '2024-01-15 10:00:00'),
('Samsung Galaxy S24', 'CTKR2', 'KR', '2024-01-16 11:30:00'),
('Xiaomi Mi 13', 'CTCN3', 'CN', '2024-01-17 09:45:00'),
('Google Pixel 8', 'CTUS4', 'US', '2024-01-18 14:20:00'),
('Sony Xperia 1 V', 'CTJP5', 'JP', '2024-01-19 16:10:00'),
('MacBook Pro M3', 'CTUS6', 'US', '2024-01-20 09:00:00'),
('Dell XPS 13', 'CTUS7', 'US', '2024-01-21 11:30:00'),
('Huawei P60', 'CTCN8', 'CN', '2024-01-22 14:45:00'),
('LG Gram', 'CTKR9', 'KR', '2024-01-23 10:15:00'),
('Asus ROG Zephyrus', 'CTTW10', 'TW', '2024-01-24 16:30:00');

-- Show table structure
DESCRIBE products;

-- Show sample data
SELECT * FROM products ORDER BY id LIMIT 10;

-- Show products by country
SELECT country_code, COUNT(*) as product_count 
FROM products 
WHERE deleted_at IS NULL 
GROUP BY country_code 
ORDER BY product_count DESC;
