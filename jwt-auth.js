/**
 * Created by JohnGuthrie on 2/16/17.
 */

var config = require('./config');
var helpers = require('./helpers');
module.exports = function jwtAuth(req, res, next) {
  const header = req.headers.authorization;
  var token = '';

  try {
    if (header !== undefined) {
      token = header.split(' ')[1];
    }
  } catch (e) {
    e.message = 'jwtAuth - ' + e.message;
    throw e;
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