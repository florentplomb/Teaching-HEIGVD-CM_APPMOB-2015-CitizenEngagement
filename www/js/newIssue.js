angular.module('citizen-engagement.newIssue', [])

.config(function($compileProvider){
<<<<<<< HEAD
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
=======
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
>>>>>>> origin/master
})

.controller('NewIssueCtrl', function($scope) {

<<<<<<< HEAD
	$scope.issue = {};

	$scope.issueTypes = [
		{ desc: 'fire' },
		{ desc: 'damage' }
	];
=======
  $scope.issue = {};

  $scope.issueTypes = [
    { desc: 'fire' },
    { desc: 'damage' }
  ];
>>>>>>> origin/master
})

.factory('Camera', ['$q', function($q) {

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/master
}])

.controller('photoCtrl', function($scope, Camera) {

<<<<<<< HEAD
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
=======
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

>>>>>>> origin/master


;

;
