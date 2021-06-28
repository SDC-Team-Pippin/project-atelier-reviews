const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'jacky',
  host: 'localhost',
  database: 'reviews',
  port: 5432
});


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

const getReviewsMetadata = () => {
  console.log('get that metadata boi');
};

module.exports = {
  getReviews,
  getReviewsMetadata
};
