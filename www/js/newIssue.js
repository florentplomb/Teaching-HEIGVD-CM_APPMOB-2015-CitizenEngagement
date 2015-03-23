var newIssueApp = angular.module('citizen-engagement.newIssue', ['geolocation'])

newIssueApp.config(function($compileProvider) {

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});

newIssueApp.controller('NewIssueCtrl', function($scope,$state,	IssueTypeService, $http, qimgUrl, qimgToken,CameraService) {

	$scope.$on('$ionicView.beforeEnter', function() {



		$scope.newIssue = {};


		IssueTypeService.getIssuesType(function(error, issuesTypes) {
			if (error) {
				$scope.error = error;
			} else {

				$scope.issueTypes = issuesTypes;
				$scope.newIssue.type = "";

			}
		});
	});

	$scope.saveIssue = function() {

		var newIssue = $scope.newIssue;

		Issue.post(callback, newissue);

		var callback = function(error, issue) {
			if (error) {
				$scope.error = error;
			} else {

			$state.go("tab.issueMapId", {
			issueId: issue.id
		});

		}

		};

	};

	$scope.addMarker = function(){

		$state.go("tab.issueMapId", {
		addMarker: 1

	});
}



	$scope.getPhoto = function() {

		CameraService.getPicture({
			quality: 75,
			targetWidth: 320,
			targetHeight: 320,
			saveToPhotoAlbum: false,
			destinationType: navigator.camera.DestinationType.DATA_URL
		}).then(function(imageData) {

			$http({
				method: "post",
				url: qimgUrl + "/images",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer " + qimgToken
				},
				data: {
					data: imageData
				}
			}).success(function(data) {

				var imageUrl = data.url;
				$scope.newIssue.photo = imageUrl;

			});
		}, function(err) {
			alert("erorr" + err);

			$scope.error = err;


		});
	};



});


newIssueApp.factory("Issue", function($http, apiUrl) {
	return {
		postIssue: function(callback, newIssue) {

			$http.post(apiUrl + "/issues", {


			  "description": "Integer at metus vitae erat porta pellentesque.",
			  "lng": "6.651479812689227",
			  "lat": "46.77227088657382",
			  "imageUrl": "http://www.somewhere.localhost.localdomain",
			  "issueTypeId": "54d8ae183fd30364605c81b1"




			}).success(function(data) {
				issue = data;

				callback(null, issue);
			}).error(function(error) {
				callback(error);
			});
		}

	}
});


newIssueApp.factory("IssueTypeService", function($http, apiUrl) {
	return {
		getIssuesType: function(callback) {
			$http.get(apiUrl + "/issueTypes").success(function(data) {
				issueType = data;
				callback(null, issueType);
			}).error(function(error) {
				callback(error);
			});
		}

	}

});



newIssueApp.factory('CameraService', ['$q', function($q) {

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


