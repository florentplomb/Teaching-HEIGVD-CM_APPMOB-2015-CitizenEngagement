var nav = angular.module('citizen-engagement.nav', [])


nav.controller('NavCtrl', function($scope,$state,$stateParams) {


$scope.goMap = function() {


$state.transitionTo("tab.issueMap", $stateParams, {
    reload: true,
    inherit: false,
    notify: true
});
};

$scope.goList = function() {
$state.go("tab.issueList", {},{reload: true});
};
});