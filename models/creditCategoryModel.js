var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var CreditCategorySchema = mongoose.Schema({
   name: String,
   default: Boolean,
   icon: String
  });

module.exports =  mongoose.model('creditcategory', CreditCategorySchema);
