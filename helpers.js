/**
 * Created by JohnGuthrie on 2/16/17.
 */
module.exports = {
  returnFail: function(res, statusCode, message, data) {
    if (!data) data = {};
    return res.status(statusCode).json({
      success: false,
      message: message,
      data: data
    });
  },

  returnSuccess: function(res, statusCode, message, data) {
    if (!data) data = {};
    return res.status(statusCode).json({
      success: true,
      message: message,
      data: data
    });
  }
};
