/* ===============================
   CREATE DATABASE
   =============================== */
CREATE DATABASE campus_food_system;
USE campus_food_system;

/* ===============================
   USERS
   =============================== */
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT','HOTEL_ADMIN','ADMIN')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','BLOCKED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* ===============================
   HOTELS
   =============================== */
CREATE TABLE hotels (
    hotel_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_name VARCHAR(100) NOT NULL,
    location VARCHAR(150),
    is_active BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* ===============================
   HOTEL ADMINS
   =============================== */
CREATE TABLE hotel_admins (
    hotel_admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    CONSTRAINT fk_hoteladmin_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_hoteladmin_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
) ENGINE=InnoDB;

/* ===============================
   MENU ITEMS
   =============================== */
CREATE TABLE menu_items (
    menu_item_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_menu_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
) ENGINE=InnoDB;

/* ===============================
   DAILY MENU
   =============================== */
CREATE TABLE daily_menu (
    daily_menu_id INT AUTO_INCREMENT PRIMARY KEY,
    menu_item_id INT NOT NULL,
    available_date DATE NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_dailymenu_item
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id)
) ENGINE=InnoDB;

/* ===============================
   PICKUP SLOTS
   =============================== */
CREATE TABLE pickup_slots (
    slot_id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT fk_pickup_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
) ENGINE=InnoDB;

/* ===============================
   ORDERS
   =============================== */
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    slot_id INT NOT NULL,
    order_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PLACED'
        CHECK (status IN ('PLACED','PREPARING','READY','COLLECTED','CANCELLED')),
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    CONSTRAINT fk_orders_slot
        FOREIGN KEY (slot_id) REFERENCES pickup_slots(slot_id)
) ENGINE=InnoDB;

/* ===============================
   ORDER ITEMS
   =============================== */
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    CONSTRAINT fk_orderitems_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_orderitems_menu
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id)
) ENGINE=InnoDB;

/* ===============================
   ORDER TOKENS
   =============================== */
CREATE TABLE order_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE NOT NULL,
    token_code VARCHAR(20) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_token_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB;
ALTER TABLE order_tokens
ADD COLUMN collected BOOLEAN DEFAULT FALSE;
/* ===============================
   PAYMENTS
   =============================== */
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PAID'
        CHECK (payment_status IN ('PAID','REFUNDED')),
    payment_mode VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB;

/* ===============================
   SUBSCRIPTIONS
   =============================== */
CREATE TABLE subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','COMPLETED','CANCELLED')),
    CONSTRAINT fk_sub_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_sub_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
) ENGINE=InnoDB;

/* ===============================
   SUBSCRIPTION ORDERS
   =============================== */
CREATE TABLE subscription_orders (
    subscription_order_id INT AUTO_INCREMENT PRIMARY KEY,
    subscription_id INT NOT NULL,
    order_id INT NOT NULL,
    CONSTRAINT fk_suborders_sub
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
    CONSTRAINT fk_suborders_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
) ENGINE=InnoDB;

/* ===============================
   ADMIN ACTIONS
   =============================== */
CREATE TABLE admin_actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_description TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_adminaction_user
        FOREIGN KEY (admin_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

CREATE TABLE collected_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token_code VARCHAR(20) UNIQUE,
  collected_at DATETIME
);