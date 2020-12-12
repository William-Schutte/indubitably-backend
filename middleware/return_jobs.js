const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path')

module.exports = (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, `../bufferdata/data${req.params.id}.json`));
    const jobs = JSON.parse(data);
    res.status(200).send({ total: jobs[0].total, jobs: jobs.slice(1) });

    fs.unlinkSync(path.join(__dirname, `../bufferdata/data${req.params.id}.json`));

  } catch (err) {
    res.status(404).send('File not found')
  }
};
