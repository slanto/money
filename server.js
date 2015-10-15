var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/budget');
var db = mongoose.connection;

db.on('error', console.error.bind(console, "connection error"));
db.once('open', function() {
  console.log("Connection to \"budget\" is open...");

  var DebitCategorySchema = mongoose.Schema({
    value: Number,
    name: String,
    default: Boolean,
    icon: String
  });

  DebitCategory = mongoose.model('debitcategory', DebitCategorySchema);

  var DebitSchema = mongoose.Schema({
   year: Number,
   month: Number,
   created: {type: Date, default: Date.now },
   category: {type: mongoose.Schema.Types.ObjectId, ref: 'debitcategory'},
   description: String,
   amount: Number
 });

 Debit = mongoose.model('debit', DebitSchema);

})

handleError = function(err) {
  console.log(err);
};

var amountFactor = 1000;

app.use(express.static(__dirname + "/public"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json());

app.get('/debit/:id', function(req, res) {
  var id = req.params.id;
  Debit.findById(id).exec(function(err, doc) {
    doc.amount = doc.amount / amountFactor;
    res.json(doc);
  });
});

app.get('/debit/:year/:month/:limit?', function(req, res) {
  var criteria = {};

  criteria.year = parseInt(req.params.year);
  criteria.month = parseInt(req.params.month);

  var limit = req.params.limit;

  var result = {};

  Debit.find(criteria)
    .limit(limit)
    .sort({created: -1})
    .populate('category')
    .exec(function(err, contacts) {
      if (err) return handleError(err);

      contacts.forEach(function(doc, index) {
          doc.amount = doc.amount / amountFactor;
      });

      res.json(contacts);
  });
});

app.get('/totaldebit/:year/:month', function(req, res) {
  var criteria = {};

  criteria.year = parseInt(req.params.year);
  criteria.month = parseInt(req.params.month);

  var total = 0;
  Debit.find(criteria)
    .exec(function(err, contacts) {
      if (err) return handleError(err);

      contacts.forEach(function(doc, index) {
          total += doc.amount;
      });

      res.json(total / amountFactor);
  });
});

var getAmount = function(str) {
  return str * amountFactor;
};

app.post('/debit', function(req, res){
  var row = req.body;
  row.amount = getAmount(row.amount);
  Debit.create(row, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/debit/:id', function(req, res) {
  var id = req.params.id;
  Debit.remove({ _id: mongoose.Types.ObjectId(id) }, function(err, doc) {
    res.json(doc);
  });
});

app.put('/debit/:id', function(req, res) {
  var id = req.params.id;
  Debit.update({_id: mongoose.Types.ObjectId(id)}, {
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

app.get('/debitcategory', function(req, res) {
    DebitCategory.find(function(err, docs) {
        res.json(docs);
    });
});

app.listen(8000, function() {
  console.log('Server running on port 8000');
});
