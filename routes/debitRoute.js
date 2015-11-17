var express = require('express'),
  mongoose = require('mongoose');

var util = require('./util');

var routes = function(Debit) {
  var debitRouter = express.Router();

  debitRouter.route('/')
    .post(function(req, res){
      var row = req.body;
      row.amount = util.getAmount(row.amount);
      Debit.create(row, function(err, doc) {
        res.json(doc);
      });
    });

  // debitRouter.use('/:debitId', function(req, res, next){
  //   req.debit = {debit: true}
  //   Debit.findById(req.params.debitId, function(err, debit) {
  //     if (err) {
  //       res.status(500).json(err);
  //     }
  //     else if (debit){
  //       console.log("found debit " + debit);
  //       req.debit = debit;
  //       next();
  //     }
  //     else {
  //       res.status(404).send('no debit found');
  //     }
  //   });
  // });

  debitRouter.route('/:id')
  .get(function(req, res) {
    var id = req.params.id;
    Debit.findById(id).exec(function(err, doc) {
      doc.amount = doc.amount / util.amountFactor();
      res.json(doc);
    });
  })
  .delete(function(req, res) {
    var id = req.params.id;
    Debit.remove({ _id: mongoose.Types.ObjectId(id) }, function(err, doc) {
      res.json(doc);
    });
  })
  .put(function(req, res) {
    var id = req.params.id;
    Debit.update({_id: mongoose.Types.ObjectId(id)}, {
          description: req.body.description,
          amount: util.getAmount(req.body.amount),
          year: req.body.year,
          month: req.body.month,
          created: req.body.created,
          category: req.body.category
        }, function(err, doc){
          res.json(doc);
        });
  });

  debitRouter.route('/:year/:month/:limit?')
  .get(function(req, res) {
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
        if (err) return util.handleError(err);

        contacts.forEach(function(doc, index) {
            doc.amount = doc.amount / util.amountFactor();
        });

        res.json(contacts);
    });
  });

  return debitRouter;
};

module.exports = routes;
