exports.amountFactor = function(){
  return 100;
};

exports.getAmount = function(str) {
  return str * this.amountFactor();
};

exports.handleError = function(err) {
  console.log(err);
};
