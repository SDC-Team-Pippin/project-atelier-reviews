const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/index.js');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

// Retrieves reviews
app.get('/reviews', (req, res) => {
  db.getReviews(req.query)
    .then(reviews => res.send(reviews))
    .catch(err => res.send());
});

// Retrieves reviews metadata
app.get('/reviews/meta', (req, res) => {
  db.getReviewsMetadata(req.query)
    .then(reviewsMetaData => res.send(reviewsMetaData))
    .catch(err => res.send());
});

// Adds a review
app.post('/reviews', (req, res) => {
  db.addReview(req.body)
    .then(response => res.status(201).send())
    .catch(err => res.status(400).send(err));
});

// Mark a review as helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  db.markHelpfulReview(req.params.review_id)
    .then(response => res.status(204).send())
    .catch(err => res.status(400).send(err));
});

// Report review
app.put('/reviews/:review_id/report', (req, res) => {
  db.reportReview(req.params.review_id)
    .then(response => res.status(204).send())
    .catch(err => res.status(400).send(err));
});
