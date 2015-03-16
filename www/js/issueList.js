var list = angular.module('citizen-engagement.issueList', [])


list.controller('ListCtrl', function($scope ,IssueService,IssueTypeService) {

$scope.filter = {};

var callback = function(error, issues){
	if (error) {
		 $scope.error = error;
	} else {

		$scope.items = issues;
	}
};

IssueService.getIssues(callback);



IssueTypeService.getIssuesType(function(error, issuesTypes){
	if (error) {
		 $scope.error = error;
	} else {

		$scope.issueTypes = issuesTypes;
		$scope.filter.type = issuesTypes[0].id;

		
	}
});




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

list.factory("IssueTypeService", function($http, apiUrl) {
return {	
		getIssuesType: function(callback){
			 $http.get(apiUrl+"/issueTypes").success(function(data){
				issueType = data;					
				callback(null, issueType);
			}).error(function(error) {
				callback(error);
			});
		}
	
}

});

