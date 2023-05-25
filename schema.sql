DROP TABLE IF EXISTS users;

CREATE TABLE users (
id SERIAL PRIMARY KEY,
location_id VARCHAR(255) NOT NULL
),

DROP TABLE IF EXISTS restaurant_rating;

CREATE TABLE restaurant_rating (
restaurant_id VARCHAR(255) PRIMARY KEY,
base_rating FLOAT,
user_reviews INTEGER,
site_reviews INTEGER
);

DROP TABLE IF EXISTS restaurant_reservation;

CREATE TABLE restaurant_reservation (
restaurant_id VARCHAR(255) PRIMARY KEY,
email VARCHAR(255),
restaurant_name VARCHAR(255),
max_reservations INTEGER,
current_reservations INTEGER,
reservation_time TIMESTAMP,
reservation_cost FLOAT DEFAULT 30
);