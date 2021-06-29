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

const addToReviewTable = (params) => {
  console.log('PARAMS:', params);

  // Insert into reviews table
  const productID = Number(params.product_id);
  const rating = Number(params.rating);
  const date = new Date().toISOString();
  const summary = params.summary;
  const body = params.body;
  const recommend = params.recommend;
  const name = params.name; // reviewer_name
  const email = params.email; // reviewer_email

  const query = `INSERT INTO reviews(product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email)VALUES (${productID}, ${rating}, ${date}, ${summary}, ${body}, ${recommend}, ${name}, ${email})`;

  return pool
    .query(query)
    .then(response => console.log('Review added! :)'))
    .catch(err => console.error(err));

};

// Adds a review to the database
const addReview = (params) => {

  // Insert into photos table
  const photos = params.photos; // [text]

  // Insert into characteristic_reviews
  const characteristics = params.characteristics; // { "14": 5, "15": 5 //...}

  return addToReviewTable(params);
};

// ===================== PUT ROUTES =====================>

const markHelpfulReview = (reviewID) => {
  const query = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = ${reviewID}`;
  return pool
    .query(query)
    .then(response => console.log('Marked a review as helpful! :D'))
    .catch(err => console.error(err));
};

const reportReview = (reviewID) => {
  const query = `UPDATE reviews SET reported = true WHERE review_id = ${reviewID}`;
  return pool
    .query(query)
    .then(response => console.log('Reported bad review! >:('))
    .catch(err => console.error(err));
};

module.exports = {
  getReviews,
  getReviewsMetadata,
  addReview,
  markHelpfulReview,
  reportReview
};
