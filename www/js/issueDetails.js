
 var detailApp = angular.module('citizen-engagement.issueDetails',[])




detailApp.controller('DetailCtrl',function($scope,$stateParams,IssueByIdService){

var issueId = $stateParams.issueId;

        $scope.custom = true;
        $scope.toggleCustom = function() {
        $scope.custom = $scope.custom === false ? true: false;};
        

var callback = function(error, issues){
	if (error) {
		 $scope.error = error;
	} else {

		$scope.issue = issue;
		
	}
};
IssueByIdService.getIssue(callback,issueId);

});

detailApp.factory("IssueByIdService", function($http, apiUrl) {
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



1