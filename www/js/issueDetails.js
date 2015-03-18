
 var detailApp = angular.module('citizen-engagement.issueDetails',[])



detailApp.controller('DetailCtrl',function($scope,$stateParams,IssueByIdService,IssuePostComment){


$scope.postComment= function(textComment){


	var issueId = $stateParams.issueId;
	
	var callback = function(error, issue){
	if (error) {
		 $scope.error = error;
	} else {

		$scope.issue = issue;
		     

		
	}
	
};
	
	IssuePostComment.postComment(callback,issueId,textComment);
	

};




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
		postComment: function(callback,issueId,textComment){
			 $http.post(apiUrl+"/issues/"+issueId+"/actions",{"type": "comment","payload": {"text": textComment}
}).success(function(data){
				issue = data;
								
				callback(null, issue);
			}).error(function(error) {
				callback(error);
			});
		}
	
}
});



