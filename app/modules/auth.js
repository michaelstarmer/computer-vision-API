const express = require('express');
const app = module.exports = express.Router();
const bodyParser = require('body-parser');
const request = require('request');
const passport = require('passport');

const bcrypt = require('bcrypt-nodejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
  res.render('auth/login');
});

app.get('/generate/:password', (req, res) => {
  let hash = bcrypt.hashSync(req.params.password);
  res.send({password: req.params.password, hash: hash});
})

app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true
    }),
  (req, res) => {
    if(req.body.remember) {
      console.log("Remember session: TRUE");
      req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
      console.log("Remember session: FALSE");
      req.session.cookie.expires = false;
    }
    res.redirect('/');
  })

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/auth');
}