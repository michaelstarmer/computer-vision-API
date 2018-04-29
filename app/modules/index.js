const {query} = require('../database/pool');

const express = require('express');
const app = module.exports = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const microsoftComputerVision = require("microsoft-computer-vision");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const API_KEY = '1fc3aa82a7fb9cd1a44350bab63985d9';
const API_SEARCH = 'https://api.themoviedb.org/3/search/movie?api_key=';

const endpointCV = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0";
const key1CV = "464e37afbbe34e458581c800cd1c10ef";
const key2CV = "71ce00fccf374247a48634916e95b2a0";

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

app.post('/computer-vision', async (req, res) => {
    
    const imageUrl = req.body.imageUrl;
    console.log("Image url:", imageUrl);

    microsoftComputerVision.analyzeImage({
        "Ocp-Apim-Subscription-Key": key1CV,
        "request-origin": "westcentralus",
        "content-type": "application/json",
        "url": imageUrl,
        "visual-features": "Tags, Faces"
    }).then((result) => {
        console.log(result);

        const tags = result.tags;
        const faces = result.faces;
        console.log("TAGS: ", tags);
        console.log("FACES:",faces);

        res.render("computer-vision/result", {
          imageUrl: imageUrl,
          tags: tags,
          faces: faces,
        });

    }).catch((err) => {
        throw err;
    });
});

app.get('/analyze', async (req, res) => {
    res.render("computer-vision/index");
});

app.get('/test', async (req, res) => {
  res.render("computer-vision/test");
})