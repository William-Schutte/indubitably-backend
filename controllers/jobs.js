const Job = require('../schemas/job.js');

module.exports = (data) => {
    const { jobId, jobTitle, jobConpany, jobLocation, jobPay, jobPosted, jobInfoSnippets, jobLink } = data;
    return Job.create({ _id: jobId, jobId, jobTitle, jobConpany, jobLocation, jobPay, jobPosted, jobInfoSnippets, jobLink })
        .then(resp => {return true})
        .catch(err => {return false});
}