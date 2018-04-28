'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const {query} = require('./database/pool');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const api = require("./modules/index");
app.use('/api', api);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;