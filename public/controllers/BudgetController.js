
	'use strict';

	  app.controller('BudgetController', ['$scope', '$http', '$filter', 'utils', function($scope, $http, $filter, utils) {

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

					utils.getTotalBalance($scope.searchYear, $scope.searchMonth)
						.then(function(response) {
							$scope.totalBalance = response;
						});
			};

			var refreshCredit = function() {

				utils.getCredits($scope.searchYear, $scope.searchMonth)
					.then(function(response) {
							$scope.credits = response;
							clearAndSetDefaultForCredit();
						});

				utils.getTotalCredit($scope.searchYear, $scope.searchMonth)
					.then(function(response){
							$scope.totalCreditAmount = response;
					});

					utils.getTotalBalance($scope.searchYear, $scope.searchMonth)
						.then(function(response) {
							$scope.totalBalance = response;
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
				$scope.debit = {
					year: $scope.searchYear,
					month: $scope.searchMonth,
					category: $scope.debitCategory[0]._id,
					amount: 0
				};

				setDefaultButtonsAvailability();
			};

			var clearAndSetDefaultForCredit = function() {
				$scope.credit = {
					year: $scope.searchYear,
					month: $scope.searchMonth,
					category: $scope.creditCategory[0]._id,
					amount: 0
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
				console.log($scope.debit);
				$http.post('/debit', $scope.debit).success(function(response) {
					refresh();
				});
			};

			$scope.saveCredit = function() {
				console.log($scope.credit);
				$http.post('/credit', $scope.credit).success(function(response) {
					refreshCredit();
				});
			};

			$scope.delete = function(id) {
				$http.delete('/debit/' + id).success(function(response) {
					refresh();
				});
			};

			$scope.deleteCredit = function(id) {
				$http.delete('/credit/' + id).success(function(response) {
					refreshCredit();
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
