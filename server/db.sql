CREATE DATABASE temple_seva;
USE temple_seva;

CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL
);

CREATE TABLE User_Profiles (
    profile_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    rashi VARCHAR(50),
    nakshatra VARCHAR(50),
    is_user BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Temples (
    temple_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    temple_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    specialties TEXT
);

CREATE TABLE Sevas (
    seva_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    temple_id BIGINT NOT NULL,
    seva_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (temple_id) REFERENCES Temples(temple_id)
);

CREATE TABLE Orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    seva_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (profile_id) REFERENCES User_Profiles(profile_id),
    FOREIGN KEY (seva_id) REFERENCES Sevas(seva_id)
);

CREATE TABLE Shipping_Addresses (
    address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_line1 VARCHAR(100) NOT NULL,
    address_line2 VARCHAR(100),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Order_Shipping (
    order_shipping_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    address_id BIGINT NOT NULL,
    shipping_date DATETIME,
    tracking_number VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (address_id) REFERENCES Shipping_Addresses(address_id)
);

-- Insert initial temple and seva data
INSERT INTO Temples (temple_name, location, specialties) VALUES
('Sri Venkateswara Temple', 'Tirupati, Andhra Pradesh', 'Famous for Lord Venkateswara'),
('Meenakshi Temple', 'Madurai, Tamil Nadu', 'Dedicated to Goddess Meenakshi');

INSERT INTO Sevas (temple_id, seva_name, description, price) VALUES
(1, 'Suprabhatam', 'Morning prayer', 200.00),
(1, 'Archana', 'Special pooja', 100.00),
(2, 'Abhishekam', 'Ritual bathing', 150.00);