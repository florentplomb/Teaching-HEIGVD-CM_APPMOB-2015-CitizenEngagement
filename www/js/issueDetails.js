
 var detailApp = angular.module('citizen-engagement.issueDetails',[])

detailApp.controller('AddCommentCtrl',function($scope,IssuePostComment){

$scope.addComment= function(){
	
	alert("hey");
};
        

});


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

detailApp.factory("IssuePostComment", function($http, apiUrl) {
return {	
		postComment: function(callback,issueId,text){
			 $http.post(apiUrl+"/issues/"+issueId+"/actions",{"type": "comment","payload": {"text": text}
}).success(function(data){
				issue = data;
								
				callback(null, issue);
			}).error(function(error) {
				callback(error);
			});
		}
	
}
});



