var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  var DebitSchema = Schema({
   year: Number,
   month: Number,
   created: {type: Date, default: Date.now },
   category: {type: mongoose.Schema.Types.ObjectId, ref: 'debitcategory'},
   description: String,
   amount: Number
  });

module.exports =  mongoose.model('debit', DebitSchema);
