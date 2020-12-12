const { spawn } = require('child_process');
const path = require('path');

const requestJobs = function(url) {
  return new Promise((resolve, reject) => {
    const childPython = spawn('python3', [path.join(__dirname, '../ind-back-end/web_requests.py'), url]);
    let totalJobs = 0;

    childPython.stdout.on('data', (data) => {
      totalJobs = data;
    });

    childPython.stderr.on('data', (data) => {
      reject(data.toString());
    });

    childPython.on('close', () => {
      resolve({ totalJobs });
    });
  });
}

const scrapeJobs = function(res, jobId) {
  return new Promise((resolve, reject) => {
    const childPython = spawn('python3', [path.join(__dirname, '../ind-back-end/web_scraper.py'), jobId, res.totalJobs]);

    childPython.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    childPython.stderr.on('data', (data) => {
      console.log(data.toString());
    });

    childPython.on('close', (code) => {
      console.log(`Web scrape status: ${code}`);
      return;
    });
  });
};

async function search(url, jobId) {
  await requestJobs(url)
    .then((res) => {
      scrapeJobs(res, jobId)
      .then((res) => {
        return Promise.resolve('Finished job');
      })
    })
    .catch((err) => console.log(err))
};

module.exports = search;
