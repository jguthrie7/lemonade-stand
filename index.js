'use strict';

var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var bitcore = require('../../node_modules/bitcore-lib/');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./user.model');
var Invoice = require('./invoice.model');
var authRouter = require('./auth.routes');

function LemonadeStand(options) {
  EventEmitter.call(this);

  this.node = options.node;
  this.log = this.node.log;

  this.invoiceHtml = fs.readFileSync(__dirname + '/invoice.html', 'utf8');
  this.amount = 12340000;

  // Use 1 HD Private Key and generate a unique address for every invoice
  this.hdPrivateKey = new bitcore.HDPrivateKey(this.node.network);
  this.log.info('Using key:', this.hdPrivateKey);
  this.addressIndex = 0;

  console.log('Connecting to MongoDB...');
  mongoose.connect('mongodb://localhost/lemonade-stand');
  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error'));
  mongoose.connection.once('open', function() {
    console.log('MongoDB connection success');
  });
}

LemonadeStand.dependencies = ['bitcoind'];

LemonadeStand.prototype.start = function(callback) {
  setImmediate(callback);
};

LemonadeStand.prototype.stop = function(callback) {
  setImmediate(callback);
};

LemonadeStand.prototype.getAPIMethods = function() {
  return [];
};

LemonadeStand.prototype.getPublishEvents = function() {
  return [];
};

LemonadeStand.prototype.setupRoutes = function(app, express) {
  var self = this;

  app.use(bodyParser.urlencoded({extended: true}));

  app.use('/', express.static(__dirname + '/static'));

  app.use('/auth', authRouter);

  //  Add middleware for checking JWT
  //  Routes after this will need to include the token
  app.use(require('./jwt-auth'));

  app.get('/myInvoice', function(req, res, next) {
    var email = req.user._doc.email;
    Invoice.find({email: email})
      .then(function(response) {
        res.status(200).send(response);
      });
  })

  app.post('/invoice', function(req, res, next) {

    console.log('token');
    console.log(req.body.token);
    self.user = req.user._doc;
    console.log('user');
    console.log(self.user);
    self.addressIndex++;
    self.amount = parseFloat(req.body.amount) * 1e8;
    self.filterInvoiceHTML()
      .then(function(HTML) {
        res.status(200).send(HTML);
      });
    // res.status(200).send(self.filterInvoiceHTML());
  });
};

LemonadeStand.prototype.getRoutePrefix = function() {
  return 'lemonade-stand';
};

LemonadeStand.prototype.filterInvoiceHTML = function() {
  var btc = this.amount / 1e8;
  var address = this.hdPrivateKey.derive(this.addressIndex).privateKey.toAddress();
  var _this = this;

  //  Insert the invoice into the database
  var newInvoice = new Invoice({
    email: this.user.email,
    address: address,
    amount: btc
  });
  return newInvoice.save()
    .then(function(res) {
      _this.log.info('New invoice with address:', address);
      var hash = address.hashBuffer.toString('hex');
      var transformed = _this.invoiceHtml
        .replace(/{{amount}}/g, btc)
        .replace(/{{address}}/g, address)
        .replace(/{{hash}}/g, hash)
        .replace(/{{baseUrl}}/g, '/' + _this.getRoutePrefix() + '/');
      return transformed;
    })
};

module.exports = LemonadeStand;
