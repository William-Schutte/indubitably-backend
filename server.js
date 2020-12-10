const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Scripts responsible for web scraping
const search_jobs = require('./middleware/search_jobs');
const scrape_jobs = require('./middleware/scrape_jobs');
const return_jobs = require('./middleware/return_jobs');

const app = express()

app.use(cors());
app.use(bodyParser.json());

app.post('/search', search_jobs, scrape_jobs, return_jobs);

app.listen(5000, () => console.log('Server listening on Port 5000'));
