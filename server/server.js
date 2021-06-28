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

// Gets reviews
app.get('/reviews', (req, res) => {
  db.getReviews(req.query)
    .then(response => {
      res.send(response);
    })
    .catch(err => res.send());
});

// // Gets reviews metadata
// app.get('/reviews/meta', (req, res) => {

// });

// // Adds a review
// app.post('/reviews', (req, res) => {

// });

// // Mark a review as helpful
// app.put('/reviews/:review_id/helpful', (req, res) => {

// });

// // Report review
// app.put('/reviews/:review_id/report', (req, res) => {

// });