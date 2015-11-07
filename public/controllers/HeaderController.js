app.controller('HeaderController', ['$scope', '$location', function($scope, $location) {
  $scope.getClass = function (viewLocation) {
    // console.log('viewlocation ' + viewLocation);
    // console.log('location ' + location.path());
      return viewLocation === $location.path() ? 'active' : '';
  };
}]);
