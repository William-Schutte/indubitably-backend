const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res, next) => {

  let url = 'https://www.indeed.com/jobs?q=react%20developer&explvl=entry_level&sort=date&fromage=14&limit=50';

  const childPython = spawn('python3', [path.join(__dirname, '../ind-back-end/web-requests.py'), url]);

  childPython.stdout.on('data', (data) => {
    console.log('oof1\n');
    console.log(data.toString());
  });

  childPython.stderr.on('data', (data) => {
    console.log('oof2');
    console.log(data.toString());
  });

  childPython.on('close', (code) => {
    console.log(`Exited with code ${code}`);
    next();
  });

};
