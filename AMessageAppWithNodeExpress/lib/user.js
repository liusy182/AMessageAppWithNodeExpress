var redis = require('redis');
var bcrypt = require('bcrypt');
var db = redis.createClient();

function User(obj) {
  for (var key in obj) {
    this[key] = obj[key];
  }
}

User.prototype.save = function (fn) {
  if (this.id) {
    // if user already has a id, update it
    this.Update(fn);
  } else {
    var user = this;
    // increment the id if it is a new user
    db.incr('user:ids', function (err, id) {
      if (err) return fn(err);
      user.id = id;
      //hash the password before saving to DB
      user.hashPassword(function (err) {
        if (err) return fn(err);
        user.update(fn);
      });
    });
  }
};

User.prototype.update = function (fn) {
  var user = this;
  var id = user.id;
  // TODO: is function set still available?
  db.set('user:id:' + user.name, id, function (err) {
    if (err) return fn(err);
    db.hmset('user:', id, user, function (err) {
      fn(err);
    });
  });
};

User.prototype.hasPassword = function (fn) {
  var user = this;
  // 12 means that we want a salk with 12 characters
  bcrypt.genSalt(12, function (err, salk) {
    if (err) return fn(err);
    user.salt = salt;
    bcrypt.hash(user.pass, salt, function (err, hash) {
      if (err) return fn(err);
      user.pass = hash;
      fn();
    });
  });
};

module.exports = User;