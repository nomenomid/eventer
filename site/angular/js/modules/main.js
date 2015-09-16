/* globals angular states */

angular.module("states", ["directives", "filters"])
       .controller("mainCtrl", MainCtrl)
       .constant("STATES_DATA_PATH", "/states");

function MainCtrl($scope, STATES_DATA_PATH, $http) {
    $scope.filterCriteria = {};
    $scope.orderBy = orderBy;
    $scope.sortField = "name";
    
    function orderBy(name) {
        if(name === $scope.sortField) return;
        $scope.sortField = name;
    }
    
    $http.get(STATES_DATA_PATH)
         .then(function(states) {
             $scope.states = states.data;
         });
}