'use strict';

var User = require('../lib/user.js');

exports.form = function (req, res) {
  res.render('login', { title: 'Login' });
};


exports.submit = function (req, res, next) {
  var data = req.body.user;
  User.authenticate(data.name, data.pass, function (err, user) {
    if (err) return next(err);
    if (user) {
      req.session.uid = user.id;
      req.redirect('/');
    } else {
      res.error('Invalid credentials!');
      res.redirect('back');
    }
  });
};

exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
    res.redirect('/');
  });
};