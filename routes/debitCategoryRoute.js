var express = require('express'),
  mongoose = require('mongoose');


  var routes = function(DebitCategory) {
    var debitCategoryRouter = express.Router();

    debitCategoryRouter.route('/')
      .get(function(req, res) {
        DebitCategory.find(function(err, docs) {
            res.json(docs);
        });
      });

      return debitCategoryRouter;
};

module.exports = routes;
