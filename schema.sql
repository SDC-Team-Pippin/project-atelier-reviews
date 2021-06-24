-- To log in:
  -- psql -d reviews -U jacky

-- To execute this file:
  -- psql -h 127.0.0.1 -d reviews -f schema.sql

DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS recommended;
DROP TABLE IF EXISTS characteristics_id;
DROP TABLE IF EXISTS characteristics_values;
DROP TABLE IF EXISTS reviews_meta;

-- Reviews data
CREATE TABLE reviews(
  product_id INT NOT NULL UNIQUE,
  review_id INT NOT NULL UNIQUE,
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
  PRIMARY KEY(product_id, review_id)
);


CREATE TABLE photos(
  photo_id INT,
  review_id INT NOT NULL,
  url VARCHAR(200),
  PRIMARY KEY(photo_id),
  FOREIGN KEY(review_id)
    REFERENCES reviews(review_id)
);

-- Reviews META DATA
CREATE TABLE reviews_meta(
  product_id INT,
  characteristics_id SERIAL UNIQUE,
  recommended_id SERIAL UNIQUE,
  PRIMARY KEY (product_id)
);

CREATE TABLE recommended(
  recommended_id INT NOT NULL,
  true_total INT,
  false_total INT,
  PRIMARY KEY(recommended_id),
  FOREIGN KEY (recommended_id)
      REFERENCES reviews_meta(recommended_id)
);

CREATE TABLE characteristics_id (
  characteristics_id INT NOT NULL,
  fit_id INT NULL,
  quality_id INT NULL,
  size_id INT NULL,
  length_id INT NULL,
  comfort_id INT NULL,
  width_id INT NULL,
  PRIMARY KEY(characteristics_id),
  FOREIGN KEY(characteristics_id)
    REFERENCES reviews_meta(characteristics_id)
);

CREATE TABLE characteristics_values (
  characteristics_id INT NOT NULL,
  fit_value INT,
  quality_value INT,
  size_value INT,
  length_value INT,
  comfort_value INT,
  width_value INT,
  PRIMARY KEY(characteristics_id),
  FOREIGN KEY(characteristics_id)
    REFERENCES reviews_meta(characteristics_id)
)
