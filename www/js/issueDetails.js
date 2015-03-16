
var detailApp = angular.module('citizen-engagement.issueDetails',[])



detailApp.controller('DetailCtrl',function($scope,$stateParams,IssueService){



var issueId = $stateParams;



var callback = function(error, issue){
	if (error) {
		 $scope.error = error;
	} else {

		$scope.issues = issue;
		console.log(issue);
	}
};

IssueService.getIssue(callback,issueId);



});


detailApp.factory("IssueService", function($http, apiUrl) {
return {	
		getIssue: function(callback,issueId){
			 $http.get(apiUrl+"/issues/"+issueId).success(function(data){
				issue = data;
								
				callback(null, issue);
			}).error(function(error) {
				callback(error);
			});
		}
	
}
});



