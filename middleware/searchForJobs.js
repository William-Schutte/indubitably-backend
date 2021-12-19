const { spawn } = require('child_process');
const path = require('path');

module.exports = (req, res, next) => {

    // let url = 'https://www.indeed.com/jobs?q=react%20developer&explvl=entry_level&sort=date&fromage=14&limit=50';
    // let url = 'https://www.indeed.com/jobs?as_and=react%20developer&jt=all&limit=50&sort&psf=advsrch&from=advancedsearch'
    const url = req.body.url;

    // res.status(202).send('Request received');

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
        // Turn string of data into a list of jobs
        dataFromPython = dataFromPython.split('\n');
        // Remove empty last element
        dataFromPython.pop();
        console.log(`Web search status: ${code}`);
        req.body.data = dataFromPython;
        const returnData = [];
        for (const j of dataFromPython) {
            returnData.push(JSON.parse(j));
        }
        res.status(202).send({ 'searchStatus': 'Search Successful', 'data': returnData });
        next();
    });
};
