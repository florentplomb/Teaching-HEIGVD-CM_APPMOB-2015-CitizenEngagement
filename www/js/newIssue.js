angular.module('citizen-engagement.newIssue', [])

.config(function($compileProvider){

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

})

.controller('NewIssueCtrl', function($scope) {


	$scope.issueTypes = [
		{ desc: 'fire' },
		{ desc: 'damage' }
	];


})

.factory('Camera', ['$q', function($q) {

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

}])

.controller('photoCtrl', function($scope, Camera) {

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
})



;

;
