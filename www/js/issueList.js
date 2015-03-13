angular.module('citizen-engagement.issueList', [])

.controller('ListCtrl', function($scope ,IssueService) {


$scope.items = IssueService.getIssue();



// $scope.items = [
//     { id: 0 },
//     { id: 1 },
//     { id: 2 },
//     { id: 3 },
//     { id: 4 },
//     { id: 5 },
//     { id: 6 }
//     ]

  
  $scope.onItemDelete = function(item) {
    $scope.items.splice($scope.items.indexOf(item), 1);
  };
  


})

.factory("IssueService", function($http, apiUrl) {
var issues = [];

	return {
		getIssue: function(){
			return $http.get(apiUrl+"/issues").then(function(response){
				issues = response;
				
				return issues;
			});
		}
	}


})

