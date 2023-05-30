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
  location_id INTEGER PRIMARY KEY,
  r_reservation_date DATE,
  r_reservation_time TIME,
  no_people_reservation INTEGER
);

DROP TABLE IF EXISTS user_comments;

CREATE TABLE user_comments (
  serial_identifier SERIAL PRIMARY KEY,
  email VARCHAR(255),
  location_id INTEGER,
  comments VARCHAR(255),
  rating FLOAT
);

DROP TABLE IF EXISTS favourite_list;

CREATE TABLE favourite_list (
location_id INTEGER PRIMARY KEY
);



