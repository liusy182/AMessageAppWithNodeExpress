'use strict';

var express = require('express');
var res = express.response;

//extend express.response to accept a message in session
res.message = function (msg, type) {
  type = type || 'info';
  var sess = this.req.session;
  sess.messages = sess.messages || [];
  sess.messages.push({ type: type, string: msg });
};

// construct a messge of type 'error'
res.error = function (msg) {
  return this.message(msg, 'error');
};


module.exports = function (req, res, next) {
  res.locals.messages = req.session.messages || [];
  res.locals.removeMessages = function () {
    req.session.messages = [];
  };
  next();
};