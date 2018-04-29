const passport = require('passport');

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated())
    return next();
  res.redirect('/auth');
}

module.exports = {isLoggedIn}