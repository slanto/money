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
var totalDebitRouter = require('./routes/totalDebitRoute')(Debit);

app.use('/debit', debitRouter);
app.use('/totaldebit', totalDebitRouter);

var getAmount = function(str) {
  return str * amountFactor;
};

app.get('/debitcategory', function(req, res) {
    DebitCategory.find(function(err, docs) {
        res.json(docs);
    });
});

//TODO: move to separate files
app.get('/credit/:id', function(req, res) {
  var id = req.params.id;
  Credit.findById(id).exec(function(err, doc) {
    doc.amount = doc.amount / amountFactor;
    res.json(doc);
  });
});

app.get('/credit/:year/:month/:limit?', function(req, res) {
  var criteria = {};

  criteria.year = parseInt(req.params.year);
  criteria.month = parseInt(req.params.month);

  var limit = req.params.limit;

  var result = {};

  Credit.find(criteria)
    .limit(limit)
    .sort({created: -1})
    .populate('category')
    .exec(function(err, credits) {
      if (err) return handleError(err);

      credits.forEach(function(doc, index) {
          doc.amount = doc.amount / amountFactor;
      });

      res.json(credits);
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

app.post('/credit', function(req, res){
  var row = req.body;
  row.amount = getAmount(row.amount);
  Credit.create(row, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/credit/:id', function(req, res) {
  var id = req.params.id;
  Credit.remove({ _id: mongoose.Types.ObjectId(id) }, function(err, doc) {
    res.json(doc);
  });
});

app.put('/credit/:id', function(req, res) {
  var id = req.params.id;
  Credit.update({_id: mongoose.Types.ObjectId(id)}, {
        description: req.body.description,
        amount: getAmount(req.body.amount),
        year: req.body.year,
        month: req.body.month,
        created: req.body.created,
        category: req.body.category
      }, function(err, doc){
        res.json(doc);
      });
});

app.get('/creditcategory', function(req, res) {
    CreditCategory.find(function(err, docs) {
        res.json(docs);
    });
});

app.listen(port, function() {
  console.log('Money app is running on port ' + port);
});
