var nav = angular.module('citizen-engagement.nav', [])


nav.controller('NavCtrl', function($scope,$rootScope,$state,$stateParams) {


$scope.goMap = function() {


$state.go("tab.issueMap", $stateParams, {
    reload: true,
    inherit: false,
    notify: true
});

};

$scope.goList = function() {
$state.go("tab.issueList", {},{reload: true});
};
});