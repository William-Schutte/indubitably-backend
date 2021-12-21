const Job = require('../schemas/job.js');

module.exports = (req, res, next) => {
    Job.deleteMany({})
        .then(resp => {
            res.status(202).send({ message: 'Deleted all jobs.', db: resp });
            console.log(`Deleted from DB: ${resp.deletedCount} jobs`);
            next();
        })
        .catch(err => console.log(err));
}