const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res, next) => {

  const childPython = spawn('python3', [path.join(__dirname, '../ind-back-end/web_scraper.py')]);

  childPython.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  childPython.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  childPython.on('close', (code) => {
    console.log(`Web scrape status: ${code}`);
    next();
  });
};
