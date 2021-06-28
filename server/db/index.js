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
  // const page = params.page;
  // const count = params.count;
  // const sort = params.sort;

  const productID = params.product_id;
  const reviewIDsArr = [];
  const query = `SELECT review_id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews WHERE product_id = ${productID}`;

  const productReview = {
    product: productID,
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
        key = ratings[key];
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
      return recommended;
    })
    .catch(err => console.error(err));
};

// Retrieves characteristics of a given product
const getCharacteristics = (productID) => {
  // OUTPUT: Object within object within object

  // TODO:
  // Find a way to connect the characteristic name to its id and value
  // 1 - Query characteristics data to get NAMES
  // 2 - Query characteristic_reviews to get IDs and VALUES of NAME

  const characteristics = {};

  const charNameQuery = `SELECT name FROM characteristics WHERE product_id = ${productID}`;
  return pool
    .query(charNameQuery)
    .then(response => {
      console.log('RESPONSE:', response.rows);
    })
    .catch(err => console.error(err));

};

// Gets review metadata for given product_id
const getReviewsMetadata = (params) => {
  // const page = params.page;
  // const count = params.count;
  // const sort = params.sort;

  const productID = params.product_id;

  const productReviewMeta = {
    product: productID,
    // ratings: {
    //   1: '1'
    // },
    // recommended: {
    //   false: '1',
    //   true: '1'
    // },
    // characteristics: {
    //   fit: {
    //     id: 1,
    //     value: '1'
    //   }
    // }
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

module.exports = {
  getReviews,
  getReviewsMetadata
};
