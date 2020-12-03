const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path')

module.exports = (req, res, next) => {
  const data = fs.readFileSync(path.join(__dirname, '../ind-back-end/data.json'));
  const jobs = JSON.parse(data);

  res.status(200).send(jobs);
};
