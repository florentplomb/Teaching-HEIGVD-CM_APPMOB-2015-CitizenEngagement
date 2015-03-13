angular.module('citizen-engagement.issueList', [])


.controller('ListCtrl', function($scope ,IssueService) {



var callback = function(error, issues){
	if (error) {
		 $scope.error = error;
	} else {
		$scope.items = issues;
	}
};

IssueService.getIssues(callback);


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
return {	
		getIssues: function(callback){
			 $http.get(apiUrl+"/issues").success(function(data){
				issues = data;
								
				callback(null, issues);
			}).error(function(error) {
				callback(error);
			});
		}
	
}

})

