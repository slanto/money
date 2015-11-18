var express = require('express'),
  mongoose = require('mongoose');

var util = require('./util');

  var routes = function(Credit) {
    var totalCreditRouter = express.Router();

    totalCreditRouter.route('/:year/:month')
    .get(function(req, res) {
      var criteria = {};

      criteria.year = parseInt(req.params.year);
      criteria.month = parseInt(req.params.month);

      var total = 0;
      Credit.find(criteria)
        .exec(function(err, credits) {
          if (err) return util.handleError(err);

          credits.forEach(function(doc, index) {
              total += doc.amount;
          });

          res.json(total / util.amountFactor());
      });
    });

    return totalCreditRouter;
  };

module.exports = routes;
