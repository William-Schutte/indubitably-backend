const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const RedisServer = require('redis-server');
const redis = require('redis');
const getJobQueue = require('./queues/getJobQueue');

// Scripts responsible for web scraping
const search_jobs = require('./middleware/search_jobs');
const scrape_jobs = require('./middleware/scrape_jobs');
const return_jobs = require('./middleware/return_jobs');

const app = express()
const redisClient = redis.createClient({host: 'localhost', port: 6379});
redisClient.on('ready',function() {
  console.log("Redis is ready");
 });
 
 redisClient.on('error',function() {
  console.log("Error in Redis");
 });

app.use(cors());
app.use(bodyParser.json());

// app.post('/search', search_jobs, scrape_jobs, return_jobs);

app.post('/search', (req, res, next) => {
  getJobQueue.add(req.body)
    .then((job) => {
      res.status(202).send({ message: "Request Accepted", jobId: job.id });
    });
});

app.get('/data/:id', return_jobs);

app.listen(5000, () => console.log('Server listening on Port 5000'));
