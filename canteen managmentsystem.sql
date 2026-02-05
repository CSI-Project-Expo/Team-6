/* ===============================
   CREATE DATABASE
   =============================== */
CREATE DATABASE campus_food_system;
GO

USE campus_food_system;
GO

/* ===============================
   USERS
   =============================== */
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) NOT NULL
        CHECK (role IN ('STUDENT','HOTEL_ADMIN','ADMIN')),
    status NVARCHAR(20) DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','BLOCKED')),
    created_at DATETIME DEFAULT GETDATE()
);

/* ===============================
   HOTELS
   =============================== */
CREATE TABLE hotels (
    hotel_id INT IDENTITY(1,1) PRIMARY KEY,
    hotel_name NVARCHAR(100) NOT NULL,
    location NVARCHAR(150),
    is_active BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE()
);

/* ===============================
   HOTEL ADMINS
   =============================== */
CREATE TABLE hotel_admins (
    hotel_admin_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    CONSTRAINT fk_hoteladmin_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_hoteladmin_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

/* ===============================
   MENU ITEMS
   =============================== */
CREATE TABLE menu_items (
    menu_item_id INT IDENTITY(1,1) PRIMARY KEY,
    hotel_id INT NOT NULL,
    item_name NVARCHAR(100) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    is_available BIT DEFAULT 1,
    CONSTRAINT fk_menu_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

/* ===============================
   DAILY MENU
   =============================== */
CREATE TABLE daily_menu (
    daily_menu_id INT IDENTITY(1,1) PRIMARY KEY,
    menu_item_id INT NOT NULL,
    available_date DATE NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT fk_dailymenu_item
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id)
);

/* ===============================
   PICKUP SLOTS
   =============================== */
CREATE TABLE pickup_slots (
    slot_id INT IDENTITY(1,1) PRIMARY KEY,
    hotel_id INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT fk_pickup_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

/* ===============================
   ORDERS
   =============================== */
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    slot_id INT NOT NULL,
    order_date DATE NOT NULL,
    status NVARCHAR(20) DEFAULT 'PLACED'
        CHECK (status IN ('PLACED','CANCELLED','COLLECTED')),
    total_amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_orders_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    CONSTRAINT fk_orders_slot
        FOREIGN KEY (slot_id) REFERENCES pickup_slots(slot_id)
);

/* ===============================
   ORDER ITEMS
   =============================== */
CREATE TABLE order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    CONSTRAINT fk_orderitems_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT fk_orderitems_menu
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(menu_item_id)
);

/* ===============================
   ORDER TOKENS
   =============================== */
CREATE TABLE order_tokens (
    token_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT UNIQUE NOT NULL,
    token_code NVARCHAR(20) UNIQUE NOT NULL,
    is_used BIT DEFAULT 0,
    CONSTRAINT fk_token_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

/* ===============================
   PAYMENTS
   =============================== */
CREATE TABLE payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_status NVARCHAR(20) DEFAULT 'PAID'
        CHECK (payment_status IN ('PAID','REFUNDED')),
    payment_mode NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

/* ===============================
   SUBSCRIPTIONS
   =============================== */
CREATE TABLE subscriptions (
    subscription_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status NVARCHAR(20) DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE','COMPLETED','CANCELLED')),
    CONSTRAINT fk_sub_user
        FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_sub_hotel
        FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

/* ===============================
   SUBSCRIPTION ORDERS
   =============================== */
CREATE TABLE subscription_orders (
    subscription_order_id INT IDENTITY(1,1) PRIMARY KEY,
    subscription_id INT NOT NULL,
    order_id INT NOT NULL,
    CONSTRAINT fk_suborders_sub
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
    CONSTRAINT fk_suborders_order
        FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

/* ===============================
   ADMIN ACTIONS
   =============================== */
CREATE TABLE admin_actions (
    action_id INT IDENTITY(1,1) PRIMARY KEY,
    admin_id INT NOT NULL,
    action_description NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_adminaction_user
        FOREIGN KEY (admin_id) REFERENCES users(user_id)
);
