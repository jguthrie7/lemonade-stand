/**
 * Created by JohnGuthrie on 2/16/17.
 */
var jwt = require('jsonwebtoken');
var config = require('./config');
var helpers = require('./helpers');
module.exports = function jwtAuth(req, res, next) {
  var header = req.headers.authorization;
  if (header !== undefined) {
    token = header.split(' ')[1];
  } else if (req.body) {
      token = req.body.token;
  } else {
    token = '';
  }
  if (token.length !== 0) {
    jwt.verify(token, config.secret, function (err, user) {
      if (err) helpers.returnFail(res, 401, 'Wrong token.');
      req.user = user;
      next();
    });
  } else {
    helpers.returnFail(res, 403, 'No token provided.');
  }
};