var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = require('bluebird');

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(attemptedPassword, savedPw, callback) {
  bcrypt.compare(attemptedPassword, savedPw,
  function(err, isMatch) {
    if (err) { callback(err); }
    callback(null, isMatch);
  });
};


userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

module.exports = User;
