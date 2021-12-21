const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    _id: String,
    jobId: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobCompany: String,
    jobPay: String,
    jobPosted: {
        type: {
            type: String,
        },
        status: String,
    },
    jobLink: String,
    jobInfoSnippets: Array,
    jobLocation: {
        remote: Boolean,
        city: String,
        state: String,
        longitude: String,
        latitude: String,
    },
});

module.exports = mongoose.model('job', jobSchema);