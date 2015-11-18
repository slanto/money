var express = require('express'),
  mongoose = require('mongoose');


  var routes = function(CreditCategory) {
    var creditCategoryRouter = express.Router();

    creditCategoryRouter.route('/')
      .get(function(req, res) {
        CreditCategory.find(function(err, docs) {
            res.json(docs);
        });
      });

      return creditCategoryRouter;
};

module.exports = routes;
