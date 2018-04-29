const {query} = require('../database/pool');

const express = require('express');
const app = module.exports = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const microsoftComputerVision = require("microsoft-computer-vision");

require('dotenv').config();

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
    
    const choice = req.body.optradio;

    if(choice == "1") {
      console.log("Selected FIND PEOPLE AND TAGS.");

      microsoftComputerVision.analyzeImage({
        "Ocp-Apim-Subscription-Key": process.env.MS_API_1,
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

    } else if(choice == "2") {
      microsoftComputerVision.describeImage({
        "Ocp-Apim-Subscription-Key": process.env.MS_API_1,
        "request-origin": "westcentralus",
        "max-candidates": "1",
        "content-type": "application/json",
        "url": imageUrl,
      }).then((result) => {
        let tags = result.description.tags;
        let captions = result.description.captions;
        console.log("DESCRIBED IMAGE:",result);
        console.log("\nTAGS:",tags);
        console.log("\nCAPTIONS:",captions);
      }).catch((err) => {
        console.log("Error analyzing image.",err);
      });
    } else if(choice == "3") {
      console.log("ANALYZING TEXT IN IMAGE.");
      microsoftComputerVision.orcImage({
        "Ocp-Apim-Subscription-Key": process.env.MS_API_1,
        "request-origin": "westcentralus",
        "language": "en",
        "content-type": "application/json",
        "detect-orientation": true,
        "url": imageUrl,
      }).then((result) => {
        console.log("\n\nRESULT FROM TEXT ANALYZER:");

        
        console.log(result.regions[0]);
        const obj = result.regions[0].lines;

        // Will get an array for every line
        const getlines = obj.map(it => it.words);
        console.log("\nLINES", getlines);
        console.log("\nNUMBER OF LINES:",getlines.length);

        let lines = []
        let stringLines = []

        // Go through every array. For every array (line),
        // push the line array to separate array.
        getlines.forEach(singleLine => {
          let text = singleLine.map(it => it.text);
          console.log("Got text:",text);
          lines.push(text.join(" "));
        });

        let separateLines = lines;

        // Array of arrays. Each array consists of all the strings on the line.
        console.log("LINES ARRAY:", lines);
        let formattedText = lines.join("\n");


        /* console.log("\n\n-- Format in view --");
        for(let l = 0; l < lines.length; l++) {
          stringLines.push(lines[l].join());
        } */

        res.render("computer-vision/result-text", {lines: formattedText, separateLines: separateLines, imageUrl: imageUrl});

      }).catch((err) => {
        console.log("Error analyzing image.",err);
      });
    }

});

app.get('/analyze', async (req, res) => {
    res.render("computer-vision/index");
});

app.get('/test', async (req, res) => {
  res.render("computer-vision/test");
})