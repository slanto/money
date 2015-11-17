var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/money');

var DebitCategory = require('./models/debitCategoryModel');

var Debit = require('./models/debitModel');

var CreditCategory = require('./models/creditCategoryModel');

var Credit = require('./models/creditModel');

handleError = function(err) {
  console.log(err);
};

var amountFactor = 100;

app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

var port = process.env.PORT || 8000;

var debitRouter = require('./routes/debitRoute')(Debit);
var creditRouter = require('./routes/creditRoute')(Credit);
var totalDebitRouter = require('./routes/totalDebitRoute')(Debit);


app.use('/debit', debitRouter);
app.use('/totaldebit', totalDebitRouter);
app.use('/credit', creditRouter);

var getAmount = function(str) {
  return str * amountFactor;
};

app.get('/debitcategory', function(req, res) {
    DebitCategory.find(function(err, docs) {
        res.json(docs);
    });
});

app.get('/creditcategory', function(req, res) {
    CreditCategory.find(function(err, docs) {
        res.json(docs);
    });
});

app.get('/totalcredit/:year/:month', function(req, res) {
  var criteria = {};

  criteria.year = parseInt(req.params.year);
  criteria.month = parseInt(req.params.month);

  var total = 0;
  Credit.find(criteria)
    .exec(function(err, credits) {
      if (err) return handleError(err);

      credits.forEach(function(doc, index) {
          total += doc.amount;
      });

      res.json(total / amountFactor);
  });
});

//TODO: use Async.waterfall
app.get('/totalbalance/:year/:month', function(req, res) {

  var criteria = {};

  criteria.year = parseInt(req.params.year);
  criteria.month = parseInt(req.params.month);

  var totalcredit = 0;
  var totaldebit = 0;
  var balance = 0;

    Credit.find(criteria)
      .exec(function(err, credits) {
        if (err) return handleError(err);
        credits.forEach(function(doc, index) {
            totalcredit += doc.amount;
        });

        Debit.find(criteria)
          .exec(function(err, contacts) {
            if (err) return handleError(err);
            contacts.forEach(function(doc, index) {
                totaldebit += doc.amount;
            });

            balance = (totalcredit - totaldebit) / amountFactor;

            res.json(balance);
        });
    });
});

app.listen(port, function() {
  console.log('Money app is running on port ' + port);
});
