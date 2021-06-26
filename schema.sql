-- To log in:
  -- psql -d reviews -U jacky

-- To execute this file:
  -- psql -h 127.0.0.1 -d reviews -f schema.sql

-- DROP TABLE IF EXISTS characteristic_reviews;
-- DROP TABLE IF EXISTS characteristics;
-- DROP TABLE IF EXISTS photos;
-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS product;

-- CREATE TABLE product(
--   product_id SERIAL NOT NULL,
--   name VARCHAR(255) NOT NULL,
--   slogan VARCHAR(255) NOT NULL,
--   description TEXT NOT NULL,
--   category VARCHAR(50) NOT NULL,
--   default_price INT NOT NULL,
--   PRIMARY KEY(product_id)
-- );

-- -- Reviews Metadata
-- CREATE TABLE reviews(
--   review_id SERIAL NOT NULL,
--   product_id INT NOT NULL,
--   rating INT NOT NULL,
--   date BIGINT NOT NULL,
--   summary TEXT NOT NULL,
--   body TEXT NOT NULL,
--   recommend BOOLEAN NOT NULL,
--   reported BOOLEAN NOT NULL,
--   reviewer_name VARCHAR(50) NOT NULL,
--   reviewer_email VARCHAR(100) NOT NULL,
--   response TEXT,
--   helpfulness INT NOT NULL,
--   PRIMARY KEY(review_id),
--   FOREIGN KEY(product_id) REFERENCES product(product_id)
-- );

-- -- Reviews Photos
-- CREATE TABLE photos(
--   id SERIAL,
--   review_id INT NOT NULL,
--   url TEXT,
--   PRIMARY KEY(id),
--   FOREIGN KEY(review_id) REFERENCES reviews(review_id)
-- );

-- -- Reviews Characteristics
-- CREATE TABLE characteristics(
--   id SERIAL NOT NULL,
--   product_id INT NOT NULL,
--   name VARCHAR NOT NULL,
--   PRIMARY KEY(id),
--   FOREIGN KEY(product_id) REFERENCES product(product_id)
-- );

-- -- Reviews Characteristic Values
-- CREATE TABLE characteristic_reviews(
--   id SERIAL NOT NULL,
--   characteristic_id INT NOT NULL,
--   review_id INT NOT NULL,
--   value INT NOT NULL,
--   PRIMARY KEY(id),
--   FOREIGN KEY(review_id) REFERENCES reviews(review_id)
-- );

-- -- ETL
-- COPY product
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/product.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY reviews
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY photos
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/reviews_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/characteristics.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristic_reviews
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;
