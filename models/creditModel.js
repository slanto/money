var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var CreditSchema = mongoose.Schema({
  year: Number,
  month: Number,
  created: {type: Date, default: Date.now },
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'creditcategory'},
  description: String,
  amount: Number
  });

module.exports  = mongoose.model('credit', CreditSchema);
