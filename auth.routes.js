const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helpers = require('./helpers');
const jwt = require('jsonwebtoken');
const config = require('./config');

const authRouter = new express.Router();
const User = mongoose.model('User');

// configure the body parser
authRouter.use(bodyParser.urlencoded({ extended: true }));
authRouter.use(bodyParser.json());
authRouter.post('/login', loginPost);
authRouter.post('/signup', signUpPost);

module.exports = authRouter;


function loginPost(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    helpers.returnFail(res, 400, 'email is a required field');
  } else if (!password) {
    helpers.returnFail(res, 400, 'password is a required field');
  } else {
    User.findOne({ email: email })
      .exec()
      .then(function (user) {
        if (!user) return helpers.returnFail(res, 404, 'No such user exist.');
        return {
          result: user.comparePassword(password),
          user: user
        }
      })
      .then(function (resultObj) {
        result = resultObj.result;
        user = resultObj.user;
        if (result) {
          // do this if it matches
          const token = jwt.sign(user, config.secret, {
            //  token only valid for 1 hour
            expiresIn: '1h'
          });
          const msg = 'Login succeeded';
          return helpers.returnSuccess(res, 200, msg, { token: token });
        }
        // do this if it doesn't
        return helpers.returnFail(res, 401, 'Wrong credentials.');
      })
      .catch(function (err) {
        console.log(err.stack);
        helpers.returnFail(res, 500, 'Failure during finding user', { err: err });
      });
  }
}

function signUpPost(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    helpers.returnFail(res, 400, 'email is a required field');
  } else if (!password) {
    helpers.returnFail(res, 400, 'password is a required field');
  } else {
    //  Check if user already exists in the database
    User.findOne({ email: email })
      .exec()
      .then(function (user) {
        if (user) return helpers.returnFail(res, 400, 'user already exists');
        //  Create the user and save in the database
        const newUser = new User({
          email: email,
          password: password
        });
        console.log('newUser');
        console.log(newUser);
        return newUser.save();
      })
      .then(function() {
        return helpers.returnSuccess(res, 201, 'account created successfully for ' + email, {});
      })
      .catch(function (err) {
        console.log(err.stack);
        return helpers.returnFail(res, 500, 'failure during create user', { err: err });
      })
  }
}
