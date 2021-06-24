-- Execute this file:
-- psql -h 127.0.0.1 -d reviews -f db/schema.sql

DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;

CREATE TABLE products(
  id INT GENERATED ALWAYS AS IDENTITY,
   product_id INT NOT NULL,
   product_name VARCHAR(255) NOT NULL,
   PRIMARY KEY(id, product_id)
);

CREATE TABLE reviews(
  id INT GENERATED ALWAYS AS IDENTITY,
  review_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  rating INT NOT NULL,
  summary TEXT NOT NULL,
  response TEXT,
  recommend BOOLEAN NOT NULL,
  body TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  reviewer_name VARCHAR(20) NOT NULL,
  helpfulness INT NOT NULL,
  photo_id INT,
  PRIMARY KEY(id, review_id),
  CONSTRAINT fk_product
    FOREIGN KEY(id)
      REFERENCES products(id)
);

-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS reviews;

-- CREATE TABLE products(
--   product_id INT NOT NULL,
--   name VARCHAR(50) NOT NULL,
--   PRIMARY KEY(product_id)
-- );

-- CREATE TABLE reviews(
--   review_id INT NOT NULL,
--   name VARCHAR(50) NOT NULL,
--   rating INT NOT NULL,
--   summary TEXT NOT NULL,
--   response TEXT,
--   recommend BOOLEAN NOT NULL,
--   body TEXT NOT NULL,
--   date TIMESTAMP NOT NULL,
--   reviewer_name VARCHAR(20) NOT NULL,
--   helpfulness INT NOT NULL,
--   photo_id INT,
--   PRIMARY KEY(review_id),
--   CONSTRAINT fk_product
--     FOREIGN KEY(product_id)
--       REFERENCES products(product_id)
-- );

-- CREATE TABLE photos (
--   photo_id PRIMARY KEY INT NULL,
--   url VARCHAR(200) NULL,
--   CONSTRAINT fk_review_id
--     FOREIGN KEY(review_id)
--       REFERENCES reviews(review_id)

-- )

-- CREATE TABLE reviews_meta (
--   id SERIAL PRIMARY KEY,
--   characteristics_id SERIAL,
--   recommended_id SERIAL,
--   CONSTRAINT fk_product__id
--     FOREIGN KEY (product_id)
--       REFERENCES products(product_id)
-- )

-- CREATE TABLE recommended (
--   true INT NULL,
--   false INT NULL,
--   CONSTRAINT fk_recommended_id,
--     FOREIGN KEY (recommended_id)
--       REFERENCES reviews_meta(reocmmended_id)
--   PRIMARY KEY(recommended_id)
-- )

-- CREATE TABLE characteristics_id (
--   fit_id INT NULL,
--   quality_id INT NULL,
--   size_id INT NULL,
--   length_id INT NULL,
--   comfort_id INT NULL,
--   width_id INT NULL,
--   CONSTRAINT fk_characteristics_id
--     FOREIGN KEY(characteristics_id)
--       REFERENCES reviews_meta(characteristics_id)
--   PRIMARY KEY(characteristics_id)
-- )

-- CREATE TABLE characteristics_values (
--   fit_value INT NULL,
--   quality_value INT NULL,
--   size_value INT NULL,
--   length_value INT NULL,
--   comfort_value INT NULL,
--   width_value INT NULL,
--   CONSTRAINT fk_characteristics_id
--     FOREIGN KEY(characteristics_id)
--       REFERENCES reviews_meta(characteristics_id)
--   PRIMARY KEY(characteristics_id)
-- )
