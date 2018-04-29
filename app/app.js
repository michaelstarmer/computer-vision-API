'use strict';

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
const {query} = require('./database/pool');
const {isLoggedIn} = require('./middleware/auth');

require('./config/passport')(passport);

// View engine and expose public dir.
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(session({ 
  secret: 'jndsjikfnweuifedfasd',
  resave: true,
  saveUninitialized: true
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const api = require("./modules/index");
const auth = require("./modules/auth");

app.use('/auth', auth);
app.use('/api', isLoggedIn, api);

app.get('/', isLoggedIn, (req, res) => {
  res.render('index');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

module.exports = app;