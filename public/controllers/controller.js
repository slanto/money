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

				utils.getDebits($scope.searchYear, $scope.searchMonth, utils.limit())
					.then(function(response) {
							$scope.debits = response;
							clearAndSetDefault();
						});

				utils.getTotalDebit($scope.searchYear, $scope.searchMonth)
					.then(function(response){
							$scope.totalAmount = response;
					});
			};

			var refreshCredit = function() {

				utils.getCredits($scope.searchYear, $scope.searchMonth, utils.limit())
					.then(function(response) {
							$scope.credits = response;
							clearAndSetDefaultForCredit();
						});

				utils.getTotalCredit($scope.searchYear, $scope.searchMonth)
					.then(function(response){
							$scope.totalCreditAmount = response;
					});
			};

			var setDefaultButtonsAvailability = function() {
				$scope.isSaveAvailable = true;
				$scope.isUpdateAvailable = false;
				$scope.isCancelUpdateAvailable = false;
				$scope.isShowAllDebitsVisible = true;
			}

			var setDefaultButtonsAvailabilityForCredit = function() {
				$scope.isSaveCreditAvailable = true;
				$scope.isUpdateCreditAvailable = false;
				$scope.isCancelUpdateCreditAvailable = false;
				$scope.isShowAllCreditsVisible = true;
			}

			var init = function() {
				$scope.years = utils.getYears();
				$scope.months = utils.getMonths();

				var date = new Date();
				$scope.searchYear = date.getFullYear();
				$scope.searchMonth = date.getMonth() + 1;

				utils.getContactTypes().then(function(response) {
					$scope.debitCategory = response;
					refresh();
				});

				utils.getCreditCategories().then(function(response) {
					$scope.creditCategory = response;
					refreshCredit();
				});
			};

			var clearAndSetDefault = function() {
				var date = new Date();
				$scope.debit = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					category: $scope.debitCategory[0]._id
				};

				setDefaultButtonsAvailability();
			};

			var clearAndSetDefaultForCredit = function() {
				var date = new Date();
				$scope.credit = {
					year: date.getFullYear(),
					month: date.getMonth() + 1,
					category: $scope.creditCategory[0]._id
				};

				setDefaultButtonsAvailabilityForCredit();
			};

			init();

			$scope.showAllDebits = function() {
				$scope.isShowAllDebitsVisible = false;
				utils.getDebits($scope.searchYear, $scope.searchMonth)
					.then(function(response) {
							$scope.debits = response;
						});
			};

			$scope.showAllCredits = function() {
				$scope.isShowAllCreditsVisible = false;
				utils.getCredits($scope.searchYear, $scope.searchMonth)
					.then(function(response) {
							$scope.credits = response;
						});
			};

			$scope.addContact = function() {
				clearAndSetDefault();
			};

			$scope.saveContact = function() {
				$http.post('/debit', $scope.debit).success(function(response) {
					refresh();
				});
			};

			$scope.saveCredit = function() {
				$http.post('/credit', $scope.credit).success(function(response) {
					refreshCredit();
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

			$scope.editCredit = function(id){
				$http.get('/credit/' + id).success(function(response) {
					$scope.credit = response;
					$scope.isSaveCreditAvailable = false;
					$scope.isUpdateCreditAvailable = true;
					$scope.isCancelUpdateCreditAvailable = true;
				});
			};

			$scope.search = function() {
				refresh();
				refreshCredit();

				// $scope.credit = {
				// 		year: $scope.searchYear,
				// 		month: $scope.searchMonth
				// };
				//
				// $scope.debit = {
				// 	year: $scope.searchYear,
				// 	month: $scope.searchMonth
				// };

			};

			$scope.update = function() {
				$http.put('/debit/' + $scope.debit._id, $scope.debit).success(function(response) {
					refresh();
				});
			};

			$scope.updateCredit = function() {
				$http.put('/credit/' + $scope.credit._id, $scope.credit).success(function(response) {
					refreshCredit();
				});
			};

			$scope.cancelUpdate = function() {
				clearAndSetDefault();
			};

			$scope.cancelUpdateCredit = function() {
				clearAndSetDefaultForCredit();
			};
	}]);

}());
