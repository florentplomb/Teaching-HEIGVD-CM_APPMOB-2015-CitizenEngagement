angular.module('citizen-engagement.newIssue', [])

.controller('NewIssueCtrl', function($scope) {

	$scope.types = [

	{
		desc: 'fire'
	},
	{
		desc : 'damage'
	},

	]

function takePicture() {
  navigator.camera.getPicture(function(imageURI) {

    // imageURI is the URL of the image that we can use for
    // an <img> element or backgroundImage.

  }, function(err) {

    // Ruh-roh, something bad happened

  }, cameraOptions);
}

module.factory('Camera', ['$q', function($q) {

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
  }
}]);

})
  



