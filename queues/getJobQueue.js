const Queue = require('bull');
const search = require('../jobs/search');

const getJobQueue = new Queue('job searching', 'redis://127.0.0.1:6379');

getJobQueue.process(1, async (job, done) => {
  console.log(job.id);
  search(job.data.url, job.id)
    .then(done);
});

module.exports = getJobQueue;
