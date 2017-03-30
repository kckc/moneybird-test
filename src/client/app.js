var app = angular.module("moneybird-test", []);

app.controller("viewCtlr", ["$scope", "$http", function($scope, $http) {
    $scope.text = "Sync with moneybird";
    $scope.sync = function () {
        $http({
            method: "POST",
            url: "/sync"
        }).then(function (response) {
            console.log(response.data)
        }, function (errResponse) {
            if (errResponse.status === 401 && !!errResponse.data.attributes.url) {
                window.location = errResponse.data.attributes.url
            }
        });
    };
}]);