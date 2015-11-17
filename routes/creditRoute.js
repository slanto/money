var express = require('express'),
  mongoose = require('mongoose');

var util = require('./util');

var routes = function(Credit) {
  var creditRouter = express.Router();

  creditRouter.route('/:year/:month/:limit?')
  .get(function(req, res) {
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
        if (err) return util.handleError(err);

        credits.forEach(function(doc, index) {
            doc.amount = doc.amount / util.amountFactor();
        });

        res.json(credits);
    });
  });

  creditRouter.route('/')
    .post(function(req, res){
      var row = req.body;
      row.amount = util.getAmount(row.amount);
      Credit.create(row, function(err, doc) {
        res.json(doc);
      });
    });

   creditRouter.route('/:id')
    .delete(function(req, res) {
      var id = req.params.id;
      Credit.remove({ _id: mongoose.Types.ObjectId(id) }, function(err, doc) {
        res.json(doc);
      });
    })
    .put(function(req, res) {
      var id = req.params.id;
      Credit.update({_id: mongoose.Types.ObjectId(id)}, {
            description: req.body.description,
            amount:util.getAmount(req.body.amount),
            year: req.body.year,
            month: req.body.month,
            created: req.body.created,
            category: req.body.category
          }, function(err, doc){
            res.json(doc);
          });
    })
    .get(function(req, res) {
      var id = req.params.id;
      Credit.findById(id).exec(function(err, doc) {
        doc.amount = doc.amount / util.amountFactor();
        res.json(doc);
      });
    });

  return creditRouter;
}

module.exports = routes;
