const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res, next) => {
    // Test url:
    // let url = 'https://www.indeed.com/jobs?as_and=react%20developer&jt=all&limit=50&sort&psf=advsrch&from=advancedsearch'

    console.time("Req Start");
    const url = req.body.url;
    const childPython = spawn('python3', [path.join(__dirname, '../ind-back-end/web_requests.py'), url]);
    let dataFromPython = "";

    childPython.stdout.on('data', (data) => {
        // Appends incoming job JSON data as a string
        dataFromPython += data.toString();
    });

    childPython.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    childPython.on('close', (code) => {
        console.log(`Web search status: ${code}`);
        if (code === 0) {
            console.log('Successful search. Returning results.')
        }
        // Turn string of data into a list of jobs
        dataFromPython = dataFromPython.split('\n');
        // Remove empty last element
        dataFromPython.pop();
        // Get job count
        const jobCount = JSON.parse(dataFromPython.pop()).jobCount;
        const returnData = [];
        for (const j of dataFromPython) {
            returnData.push(JSON.parse(j));
        }

        console.timeEnd("Req Start");
        res.status(202).send({ 'searchStatus': 'Search Successful', 'jobCount': jobCount, 'data': returnData });
        next();
    });
};
