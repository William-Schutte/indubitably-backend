const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const RedisServer = require('redis-server');
// const redis = require('redis');
// const getJobQueue = require('./queues/getJobQueue');

// Scripts responsible for web scraping
const searchForJobs = require('./middleware/searchForJobs');
const saveJobsToDB = require('./middleware/saveJobsToDB');

const app = express()
app.use(cors());
app.use(bodyParser.json());

app.post('/search', searchForJobs);

app.listen(8000, () => console.log('Server listening on Port 8000'));
