var express = require('express'),
  mongoose = require('mongoose');

var util = require('./util');

  var routes = function(Debit) {
    var totalDebitRouter = express.Router();

    totalDebitRouter.route('/:year/:month')
      .get(function(req, res){
        var criteria = {};

        criteria.year = parseInt(req.params.year);
        criteria.month = parseInt(req.params.month);

        var total = 0;
        Debit.find(criteria)
          .exec(function(err, contacts) {
            if (err) return util.andleError(err);

            contacts.forEach(function(doc, index) {
                total += doc.amount;
            });

            res.json(total / util.amountFactor());
        });
      });
      return totalDebitRouter;
    };

    module.exports = routes;
