module.exports = (req, res, next) => {

    const jobData = req.body.data;
    // Due to splitting by \n, the last entry should be empty
    console.log(jobData.length);
    console.log(jobData[jobData.length - 1]);
    
};
