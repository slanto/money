
  'use strict';

  var app = angular.module('myApp', ['ngRoute']);

  app.config(function($routeProvider){
      $routeProvider
        .when("/budget", {
          templateUrl: "budget.html",
          controller: "BudgetController"
        })
				.when("/report", {
					templateUrl: "report.html",
					controller: "ReportController"
				})
        .otherwise({
          redirectTo: "/budget"
        });
  });
