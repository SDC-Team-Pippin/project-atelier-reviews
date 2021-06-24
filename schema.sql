-- To log in:
  -- psql -d reviews -U jacky

-- To execute this file:
  -- psql -h 127.0.0.1 -d reviews -f schema.sql

-- DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS photos;
-- DROP TABLE IF EXISTS characteristics;
-- DROP TABLE IF EXISTS characteristic_values;

-- Reviews Metadata
CREATE TABLE reviews(
  product_id INT NOT NULL,
  review_id INT NOT NULL,
  rating INT NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR NOT NULL,
  reviewer_email VARCHAR NOT NULL,
  response TEXT,
  helpfulness INT NOT NULL,
  PRIMARY KEY(product_id, review_id)
);

-- Reviews Photos
CREATE TABLE photos(
  id SERIAL,
  review_id INT,
  url VARCHAR,
  PRIMARY KEY(id)
);

-- Reviews Characteristics
CREATE TABLE characteristics(
  id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR NOT NULL,
  PRIMARY KEY(id)
);

-- Reviews Characteristic Values
CREATE TABLE characteristic_values(
  id INT NOT NULL,
  characteristic_id INT NOT NULL,
  review_id INT NOT NULL,
  value INT NOT NULL,
  PRIMARY KEY(id)
);

-- ETL
-- COPY reviews(product_id, review_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/reviews.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY photos(id, review_id, url)
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/reviews_photos.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristics(id, product_id, name)
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/characteristics.csv'
-- DELIMITER ','
-- CSV HEADER;

-- COPY characteristic_values(id, characteristic_id, review_id, value)
-- FROM '/Users/jacky/Documents/Hack Reactor/RFP53/characteristic_reviews.csv'
-- DELIMITER ','
-- CSV HEADER;
