var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var DebitCategorySchema = mongoose.Schema({
    value: Number,
    name: String,
    default: Boolean,
    icon: String
  });

module.exports =  mongoose.model('debitcategory', DebitCategorySchema);
