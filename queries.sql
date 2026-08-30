CREATE DATABASE tiles;

USE tiles;

CREATE TABLE tile_orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  tile_name VARCHAR(100),
  total_amount DECIMAL(10,2),
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
