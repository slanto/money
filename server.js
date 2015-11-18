var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/money');

var DebitCategory = require('./models/debitCategoryModel');
var Debit = require('./models/debitModel');
var CreditCategory = require('./models/creditCategoryModel');
var Credit = require('./models/creditModel');

app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var debitRouter = require('./routes/debitRoute')(Debit);
var creditRouter = require('./routes/creditRoute')(Credit);
var totalDebitRouter = require('./routes/totalDebitRoute')(Debit);
var totalCreditRouter = require('./routes/totalCreditRoute')(Credit);
var totalBalanceRouter = require('./routes/totalBalanceRoute')(Debit, Credit);
var debitCategoryRouter = require('./routes/debitCategoryRoute')(DebitCategory);
var creditCategoryRouter = require('./routes/creditCategoryRoute')(CreditCategory);

app.use('/debit', debitRouter);
app.use('/totaldebit', totalDebitRouter);
app.use('/credit', creditRouter);
app.use('/totalcredit', totalCreditRouter);
app.use('/totalbalance', totalBalanceRouter);
app.use('/debitcategory', debitCategoryRouter);
app.use('/creditcategory', creditCategoryRouter);

app.listen(port, function() {
  console.log('Money app is running on port ' + port);
});
