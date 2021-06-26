const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'jacky',
  host: 'localhost',
  database: 'Reviews',
  port: 5432
});

const getReviews = () => {
  console.log('get those reviews boi');
};

const getReviewsMetadata = () => {
  console.log('get that metadata boi');
};

module.exports = {
  getReviews,
  getReviewsMetadata
};
