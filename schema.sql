DROP TABLE IF EXISTS restaurant_details;

CREATE TABLE restaurant_details (
  r_location_id INTEGER PRIMARY KEY,
  r_image VARCHAR(255),
  r_name VARCHAR(255),
  r_address VARCHAR(255),
  r_max_reservation INTEGER,
  r_reservation_cost FLOAT,
  r_reservation_count INTEGER
);

DROP TABLE IF EXISTS restaurant_reservation;

CREATE TABLE restaurant_reservation (
  r_location_id INTEGER REFERENCES restaurant_details (r_location_id),
  r_reservation_time DATE,
  r_actual_cost FLOAT
);

DROP TABLE IF EXISTS user_comments;

CREATE TABLE user_comments (
  serial_identifier SERIAL PRIMARY KEY,
  email VARCHAR(255),
  location_id VARCHAR(255),
  comments VARCHAR(255),
  rating FLOAT
);
