const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'jacky',
  host: 'localhost',
  database: 'reviews',
  port: 5432
});

// ===================== GET '/reviews/' ROUTES =====================>

// Gets photo_id and url for every review_id
const getPhotos = (reviewIDs) => {
  let photosPromises = [];
  for (let i = 0; i < reviewIDs.length; i++) {
    const query = `SELECT id, url FROM photos WHERE review_id = ${reviewIDs[i]}`;
    photosPromises.push(
      pool
        .query(query)
        .then(photos => {
          if (photos.rows.length === 0) {
            return null;
          } else {
            return photos.rows;
          }
        })
        .catch(err => console.error(err))
    );
  }

  return Promise.all(photosPromises).then(photos => {
    return photos;
  });
};

// Gets all reviews for given product_id
const getReviews = (params) => {
  const page = params.page;
  const count = params.count;
  const productID = params.product_id;
  const reviewIDsArr = [];
  const query = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${productID}`;

  const productReview = {
    product: productID,
    page: page,
    count: count,
  };

  return pool
    .query(query)
    .then(reviews => {
      productReview.results = reviews.rows;

      // Gets all reviewIDs of a product
      for (let i = 0; i < reviews.rows.length; i++) {
        reviewIDsArr.push(reviews.rows[i].review_id);
      }

      // Gets all photos of a reviewID
      return getPhotos(reviewIDsArr)
        .then(photos => {
          for (let i = 0; i < productReview.results.length; i++) {
            productReview.results[i].photos = photos[i];
          }
          return productReview;
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

// ===================== GET '/reviews/meta' ROUTES =====================>

// Get all ratings of a given productID
const getRatings = (productID) => {
  const ratings = {};
  const query = `SELECT rating FROM reviews WHERE product_id = ${productID}`;
  return pool
    .query(query)
    .then(response => {
      for (let i = 0; i < response.rows.length; i++) {
        if (ratings[response.rows[i].rating] === undefined) {
          ratings[response.rows[i].rating] = 1;
        } else {
          ratings[response.rows[i].rating]++;
        }
      }

      // Stringifies number values
      for (let key in ratings) {
        ratings[key] = JSON.stringify(ratings[key]);
      }
      return ratings;
    })
    .catch(err => console.error(err));
};

// Gets number of recommended input for a given productID
const getRecommended = (productID) => {
  const recommended = {};
  const query = `SELECT recommend FROM reviews WHERE product_id = ${productID}`;
  return pool
    .query(query)
    .then(response => {
      for (let i = 0; i < response.rows.length; i++) {
        if (recommended[response.rows[i].recommend] === undefined) {
          recommended[response.rows[i].recommend] = 1;
        } else {
          recommended[response.rows[i].recommend]++;
        }
      }

      // Stringifies number values
      for (let key in recommended) {
        recommended[key] = JSON.stringify(recommended[key]);
      }

      return recommended;
    })
    .catch(err => console.error(err));
};

// Gets all review IDs
const getReviewIDs = (productID) => {
  let reviewIDs = [];
  const query = `SELECT review_id FROM reviews WHERE product_id = ${productID}`;
  return pool
    .query(query)
    .then(response => {
      response.rows.map(review => reviewIDs.push(review.review_id));
      return reviewIDs;
    })
    .catch(err => console.error(err));
};

// Gets characteristic_id and values for given review_id
const getCharValues = (reviewIDs) => {
  let charValues = [];
  for (let i = 0; i < reviewIDs.length; i++) {
    const query = `SELECT characteristic_id, value FROM characteristic_reviews WHERE review_id = ${reviewIDs[i]}`;
    return pool
      .query(query)
      .then(values => {
        for (let i = 0; i < values.rows.length; i++) {
          var charObj = {
            id: JSON.stringify(values.rows[i].characteristic_id),
            value: JSON.stringify(values.rows[i].value)
          };
          charValues.push(charObj);
        }

        return charValues;
      })
      .catch(err => console.error(err));
  }
};

// Retrieves characteristics of a given product
const getCharacteristics = (productID) => {
  const characteristics = {};
  const charNameQuery = `SELECT name FROM characteristics WHERE product_id = ${productID}`;

  return pool
    .query(charNameQuery)
    .then(charNames => {
      // Adds characteristic names to object
      for (let i = 0; i < charNames.rows.length; i++) {
        let charName = charNames.rows[i].name;
        characteristics[charName] = {};
      }
      return getReviewIDs(productID)
        .then(reviewIDs => {
          return getCharValues(reviewIDs)
            .then(charValues => {
              let counter = 0;
              for (let key in characteristics) {
                characteristics[key] = charValues[counter];
                counter++;
              }
              return characteristics;
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
};

// Gets review metadata for given product_id
const getReviewsMetadata = (params) => {
  const productID = params.product_id;

  const productReviewMeta = {
    product: productID,
  };

  return getRatings(productID)
    .then(ratingsMeta => {
      productReviewMeta.ratings = ratingsMeta; // values need to be wrapped in double quotes
    })
    .then(response => {
      return getRecommended(productID)
        .then(recommendedMeta => {
          productReviewMeta.recommended = recommendedMeta; // values need to be wrapped in double quotes
        });
    })
    .then(response => {
      return getCharacteristics(productID)
        .then(characteristicsMeta => {
          productReviewMeta.characteristics = characteristicsMeta;
          return productReviewMeta;
        });
    })
    .catch(err => console.error(err));

};

// ===================== POST '/reviews/' ROUTES =====================>

// Update reviews table
const addToReviewTable = (params) => {
  const productID = params.product_id;
  const rating = params.rating;
  const date = new Date().toISOString().replace('T', ' ').replace('Z', '');
  const summary = params.summary;
  const body = params.body;
  const recommend = params.recommend === 'true';
  const name = params.name;
  const email = params.email;

  const query = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email, reported, helpfulness) VALUES (${productID}, ${rating}, '${date}', '${summary}', '${body}', ${recommend}, '${name}', '${email}', false, 0)`;

  return pool
    .query(query)
    .catch(err => console.error(err));
};

// Gets the most recent review_id
const getLatestReviewID = () => {
  const query = 'SELECT review_id FROM reviews ORDER BY review_id DESC LIMIT 1';
  return pool
    .query(query)
    .then(response => {
      return response.rows[0].review_id;
    })
    .catch(err => console.error(err));
};

// Update photo table
const addToPhotoTable = (url) => { // CURRENTLY IS ONLY ABLE TO UPDATE ONE PHOTO PER REVIEW
  if (!url) {
    return;
  } else {
    return getLatestReviewID()
      .then(id => {
        const query = `INSERT INTO photos(review_id, url) VALUES (${id}, '${url}')`;
        return pool
          .query(query)
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }
};

// Update characteristic_reviews table
const addToCharReviews = (chars) => { // { "6": 9, "4": 20 }
  let charIDs = Object.keys(chars);
  let charVals = Object.values(chars);
  let charPromises = [];

  getLatestReviewID()
    .then(id => {
      for (let i = 0; i < charIDs.length; i++) {
        const query = `INSERT INTO characteristic_reviews(characteristic_id, review_id, value) VALUES (${charIDs[i]}, ${id}, ${charVals[i]})`;
        charPromises.push(
          pool
            .query(query)
            .catch(err => console.error(err))
        );
      }
    })
    .catch(err => console.error(err));

  return Promise.all(charPromises);
};

// Adds a review to the database
const addReview = (params) => {
  return addToReviewTable(params)
    .then(response => {
      return addToPhotoTable(params.photos)
        .then(response => {
          return addToCharReviews(params.characteristics)
            .catch(err => console.error(err));
        });
    });
};

// ===================== PUT ROUTES =====================>

const markHelpfulReview = (reviewID) => {
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${reviewID}`;
  return pool
    .query(query)
    .catch(err => console.error(err));
};

const reportReview = (reviewID) => {
  const query = `UPDATE reviews SET reported = true WHERE review_id = ${reviewID}`;
  return pool
    .query(query)
    .catch(err => console.error(err));
};

module.exports = {
  getReviews,
  getReviewsMetadata,
  addReview,
  markHelpfulReview,
  reportReview
};
