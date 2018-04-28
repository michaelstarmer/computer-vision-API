const {query} = require('../database/pool');

const express = require('express');
const app = module.exports = express.Router();
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const API_KEY = '1fc3aa82a7fb9cd1a44350bab63985d9';
const API_SEARCH = 'https://api.themoviedb.org/3/search/movie?api_key=';

app.get('/search', (req, res) => {
    res.render('search/index');
});

app.post('/search', async (req, res) => {
    let q = req.body.query;
    q = encodeURIComponent(q);

    try {
        const search = await request(API_SEARCH + API_KEY + '&language=en-US&query=' + q + '&page=1&include_adult=false', function(error, response, body) {
            console.log("error: ",error);
            console.log("status code: ",response && response.statusCode);

            let json = JSON.parse(body);
            let movies = json.results;



            console.log("Result 0: ", json.results[0]);
            
            res.render('search/result', {movies: movies});
        });
    } catch (e) {
        console.log("An error occured...");
        return;
    }
    
});