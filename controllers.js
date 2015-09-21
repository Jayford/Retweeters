    angular.module("myapp", [])
        .controller("MyController", function($scope, $http) {
            $scope.myData = {};
            $scope.myData.doClick = function(item, event) {
                
    $scope.users= "";
    $http.get("http://localhost:8080/?name=" + $scope.name.value).
    success(function(data, status, headers, config) {
      $scope.users = data;
    }).
    error(function(data, status, headers, config) {
      // log error
    });


        }
    });