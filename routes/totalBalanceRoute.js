var express = require('express'),
  mongoose = require('mongoose');

var util = require('./util');

  var routes = function(Debit, Credit) {
    var totalBalanceRouter = express.Router();

    totalBalanceRouter.route('/:year/:month')
      .get(function(req, res) {

        var criteria = {};

        criteria.year = parseInt(req.params.year);
        criteria.month = parseInt(req.params.month);

        var totalcredit = 0;
        var totaldebit = 0;
        var balance = 0;

          Credit.find(criteria)
            .exec(function(err, credits) {
              if (err) return util.handleError(err);
              credits.forEach(function(doc, index) {
                  totalcredit += doc.amount;
              });

              Debit.find(criteria)
                .exec(function(err, contacts) {
                  if (err) return util.handleError(err);
                  contacts.forEach(function(doc, index) {
                      totaldebit += doc.amount;
                  });

                  balance = (totalcredit - totaldebit) / util.amountFactor();

                  res.json(balance);
              });
          });
      });

      return totalBalanceRouter;
};

module.exports = routes;
