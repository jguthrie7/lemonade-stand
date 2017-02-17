const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;
const Schema = mongoose.Schema;

//  define user schema
const invoiceSchema = new Schema({
  email: String,
  address: String,
  amount: Number
});

module.exports = mongoose.model('invoice', invoiceSchema);