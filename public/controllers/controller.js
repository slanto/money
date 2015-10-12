(function () {
	'use strict';

  var myApp = angular.module('myApp', []);

	 myApp.filter('monthName', ['utils', function(utils) {
			return function (monthNumber) { //1 = January
					var monthNames = utils.getMonths();
					return monthNames[monthNumber];
			}
		}]);

		myApp.service('utils', ['$http', '$q', function($http, $q) {
				return {
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
						getContactList: function(year, month) {
							var deffered = $q.defer();
							$http.get('/debit/' + year + '/' + month)
								.success(function(response) {
									deffered.resolve(response);
								})
								.error(function(msg, code){
									deffered.reject(msg);
								});
								return deffered.promise;
						},
						getTypeById: function(input, id) {
							var i = 0, len = input.length;
					    for (; i<len; i++) {
					      if (+input[i].value === +id) {
					        return input[i];
					      }
					    }
					    return null;
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
						getMonths: function(locale) {
							locale = locale || "pl-PL";
							var months = [];
							months.push("--Wybierz miesiąc--")
							for(var i = 0; i < 12; i++) {
								var date = new Date();
								date.setMonth(i);
								months.push(date.toLocaleString(locale, { month: "long" }));
							}
							return months;
						}
					}
				}]);

	  myApp.controller('AppCtrl', ['$scope', '$http', '$filter', 'utils', function($scope, $http, $filter, utils) {

			var refresh = function() {
				utils.getContactList($scope.searchYear, $scope.searchMonth).then(function(response){
						var debits = [];
						angular.forEach(response.items, function(value, key) {
							var debit = value;
							var foundType = utils.getTypeById($scope.debitCategory, value.category);

							debit.category = {
								id: foundType.value,
								name: foundType.name,
								icon: foundType.icon
							}

							debits.push(debit);
						});
						$scope.debits = debits;
						$scope.totalAmount = response.totalAmount;
						clearAndSetDefault();
				});
			};

			var setDefaultButtonsAvailability = function() {
				$scope.isSaveAvailable = true;
				$scope.isUpdateAvailable = false;
				$scope.isCancelUpdateAvailable = false;
			}

			var init = function() {
				$scope.years = utils.getYears();
				$scope.months = utils.getMonths();

				//setDefaultButtonsAvailability();

				var date = new Date();
				$scope.searchYear = date.getFullYear();
				$scope.searchMonth = date.getMonth() + 1;

				utils.getContactTypes().then(function(response) {
					$scope.debitCategory = response;
					refresh();
				});
			};

			var clearAndSetDefault = function() {
				var date = new Date();
				$scope.debit = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					type: 1
				};

				setDefaultButtonsAvailability();
			};

			init();

			$scope.addContact = function() {
				clearAndSetDefault();
			};

			$scope.saveContact = function() {
				// console.log($scope.debit);
				$http.post('/debit', $scope.debit).success(function(response) {
					refresh();
				});
			};

			$scope.delete = function(id) {
				$http.delete('/debit/' + id).success(function(response) {
					refresh();
				});
			};

			$scope.parseInt = function(number) {
        return parseInt(number, 10);
    	};

			$scope.edit = function(id){
				$http.get('/debit/' + id).success(function(response) {
					$scope.debit = response;
					$scope.isSaveAvailable = false;
					$scope.isUpdateAvailable = true;
					$scope.isCancelUpdateAvailable = true;
				});
			};

			$scope.search = function() {
				refresh();
			};

			$scope.update = function() {
				$http.put('/debit/' + $scope.debit._id, $scope.debit).success(function(response) {
					refresh();
				});
			};

			$scope.cancelUpdate = function() {
				clearAndSetDefault();
			};
	}]);

}());
