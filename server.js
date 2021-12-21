const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Scripts responsible for web scraping
const searchForJobs = require('./middleware/searchForJobs');
const saveJobsToDB = require('./middleware/saveJobsToDB');
const getAllFromDB = require('./middleware/getAllFromDB');
const clearAllJobs = require('./middleware/clearAllJobs');

const app = express();
mongoose.connect('mongodb://localhost:27017/indubitably',{
    useNewUrlParser: true,
});
app.use(cors());
app.use(bodyParser.json());

app.post('/search', searchForJobs, saveJobsToDB);
app.get('/getdb', getAllFromDB);
app.post('/cleardb', clearAllJobs);

app.listen(8000, () => console.log('Server listening on Port 8000'));
