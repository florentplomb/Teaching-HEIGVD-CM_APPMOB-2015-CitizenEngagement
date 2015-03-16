var list = angular.module('citizen-engagement.issueList', [])


list.controller('ListCtrl', function($scope ,IssueService) {



var callback = function(error, issues){
	if (error) {
		 $scope.error = error;
	} else {
		$scope.items = issues;
	}
};

IssueService.getIssues(callback);



 $scope.data = {
    showDelete: false
  };

  
  $scope.onItemDelete = function(issue) {
    $scope.issues.splice($scope.items.indexOf(item), 1);
  };


});





list.factory("IssueService", function($http, apiUrl) {
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

});

