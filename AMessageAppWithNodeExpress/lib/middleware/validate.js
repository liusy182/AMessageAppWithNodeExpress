'use strict';

// parse strings like "item[sub1][sub2]" to
// an array ["item", "sub1", "sub2"]
var parseField = function (field) {
  return field.split(/\[|\]/).filter(function (s) { return s });
};

var getField = function (req, field) {
  var val = req.body;
  //recursively look into object's object
  field.forEach(function (prop) { 
    val = val[prop];
  });
  return val;
};

exports.required = function (field) {
  field = parseField(field);
  return function (req, res, next) {
    if (getField(req, field)) {
      next();
    } else {
      res.error(field.join(' ') + ' is required');
      res.redirect('back');
    }
  };
};

exports.lengthAbove = function (field, len) {
  field = parseField(field);
  return function (req, res, next) {
    if (getField(req, field).length > len) {
      next();
    } else {
      res.error(field.join(' ') + ' must have more than ' + len + ' characters');
      res.redirect('back');
    }
  };
};