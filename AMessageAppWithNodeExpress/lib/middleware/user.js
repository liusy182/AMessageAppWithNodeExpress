'use strict';
//this middleware will load user information from database

var User = require('../user');

module.exports = function (req, res, next) {
  var uid = req.session.uid; // attempt to get logged in use id from session
  if (!uid) return next();
  User.get(uid, function (err, user) { // get from redis if not found in session
    if (err) return next(err);
    req.user = res.locals.user = user; // expose user data to response obj
    next();
  });
};

