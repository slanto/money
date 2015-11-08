app.filter('monthName', ['utils', function(utils) {
   return function (monthNumber) { //1 = January
       var monthNames = utils.getMonths();
       return monthNames[monthNumber];
   }
 }]);
