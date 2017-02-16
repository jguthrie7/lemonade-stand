const mongoose = require('mongoose');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

//  define user schema
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', encryptPassword);
userSchema.methods.comparePassword = comparePassword;

// Function to encrypt password
function encryptPassword(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  //  generate a salt, hash, and then assign the password
  return bcrypt.genSaltAsync(SALT_WORK_FACTOR)
    .then(function (salt) {
      return bcrypt.hashAsync(user.password, salt);
    })
    .then(function (hash) {
      user.password = hash;
      return next();
    })
    .catch(function (err) {
      return next(err);
    });
}

//  Returns promise with value true if password matches or false if no match
function comparePassword(candidatePassword) {
  return bcrypt.compareAsync(candidatePassword, this.password)
    .catch(function (err) {
      err.message = 'comparePassword - ' + err.message;
      return err;
    });
}

module.exports = mongoose.model('User', userSchema);