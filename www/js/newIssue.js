var newIssueApp = angular.module('citizen-engagement.newIssue', [])

newIssueApp.config(function($compileProvider){

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});

newIssueApp.controller('NewIssueCtrl', function($scope,IssueTypeService) {


	// $scope.issueTypes = [
	// 	{ desc: 'fire' },
	// 	{ desc: 'damage' }
	// ];

	IssueTypeService.getIssuesType(function(error, issuesTypes){
	if (error) {
		 $scope.error = error;
	} else {

		$scope.issueTypes = issuesTypes;
		//$scope.filter.type = issuesTypes[0].id;

		
	}
});


});

newIssueApp.factory("IssueTypeService", function($http, apiUrl) {
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



newIssueApp.factory('Camera', ['$q', function($q) {

	return {
		getPicture: function(options) {
			var q = $q.defer();

			navigator.camera.getPicture(function(result) {
       		// Do any magic you need
       			q.resolve(result);
   			}, function(err) {
   				q.reject(err);
   			}, options);

			return q.promise;
		}
	};

}]);

newIssueApp.controller('photoCtrl', function($scope, Camera) {

	$scope.getPhoto = function() {
		Camera.getPicture({
			quality: 75,
			targetWidth: 320,
			targetHeight: 320,
			saveToPhotoAlbum: false
		}).then(function(imageURI) {
			console.log(imageURI);
       		$scope.lastPhoto = imageURI; //Last picture
    	}, function(err) {
    		$scope.error = err;
    		console.err(err);
    	});
    };
});


