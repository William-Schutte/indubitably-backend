const createJob = require('../controllers/jobs.js');

module.exports = (req, res, next) => {

    const jobData = req.body.data;

    let n = 0;
    for (const job of jobData) {
        const jobDb = createJob(job);
    }
    next();
};
