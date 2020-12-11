const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res, next) => {

  // let url = 'https://www.indeed.com/jobs?q=react%20developer&explvl=entry_level&sort=date&fromage=14&limit=50';
  let url = req.body.url;

  res.status(202).send('Request received');
  
  const childPython = spawn('python3', [path.join(__dirname, '../ind-back-end/web_requests.py'), url]);

  childPython.stdout.on('data', (data) => {
    console.log(data.toString());
    req.body.number = data;
  });

  childPython.stderr.on('data', (data) => {
    console.log(data.toString());
  });

  childPython.on('close', (code) => {
    console.log(`Web search status: ${code}`);
    next();
  });
};
