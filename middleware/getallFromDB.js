const Job = require('../schemas/job.js');

module.exports = (req, res, next) => {
    Job.find({})
        .then((result) => {
            res.status(200).send({ message: 'Retrieval succesful', data: result });
            next();
        })
        .catch(err => console.log(err));
}