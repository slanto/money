app.service('utils', ['$http', '$q', function($http, $q) {
    return {
      limit: function() {
        return 5;
      },
      getContactTypes: function() {
        var deffered = $q.defer();
          $http.get('/debitcategory')
            .success(function(response){
              deffered.resolve(response);
            })
            .error(function(msg, code) {
              deffered.reject(msg);
            });
          return deffered.promise;
        },
        getDebits: function(year, month, limit) {
          var deffered = $q.defer();
          $http.get('/debit/' + year + '/' + month + '/' + limit)
            .success(function(response) {
              deffered.resolve(response);
            })
            .error(function(msg, code){
              deffered.reject(msg);
            });
            return deffered.promise;
        },
        getTotalDebit: function(year, month) {
          var deffered = $q.defer();
          $http.get('/totaldebit/' + year + '/' + month)
            .success(function(response) {
              deffered.resolve(response);
            })
            .error(function(msg, code){
              deffered.reject(msg);
            });
            return deffered.promise;
        },
        getCreditCategories: function() {
          var deffered = $q.defer();
            $http.get('/creditcategory')
              .success(function(response){
                deffered.resolve(response);
              })
              .error(function(msg, code) {
                deffered.reject(msg);
              });
            return deffered.promise;
          },
          getCredits: function(year, month, limit) {
            var deffered = $q.defer();
            $http.get('/credit/' + year + '/' + month + '/' + limit)
              .success(function(response) {
                deffered.resolve(response);
              })
              .error(function(msg, code){
                deffered.reject(msg);
              });
              return deffered.promise;
          },
          getTotalCredit: function(year, month) {
            var deffered = $q.defer();
            $http.get('/totalcredit/' + year + '/' + month)
              .success(function(response) {
                deffered.resolve(response);
              })
              .error(function(msg, code){
                deffered.reject(msg);
              });
              return deffered.promise;
          },
          getTotalBalance: function(year, month) {
            var deffered = $q.defer();
            $http.get('/totalbalance/' + year + '/' + month)
              .success(function(response) {
                deffered.resolve(response);
              })
              .error(function(msg, code){
                deffered.reject(msg);
              });
              return deffered.promise;
          },
        getYears: function() {
          var currentYear = new Date().getFullYear();
          var years = [];
          var startYear = 2009
          while (startYear <= currentYear) {
            years.push(startYear);
            startYear++;
          }
          return years;
        },
        getMonths: function() {
          var months = ['--Wybierz miesiąc--', 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
          return months;
        }
      }
    }]);
