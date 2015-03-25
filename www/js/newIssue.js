var newIssueApp = angular.module('citizen-engagement.newIssue', ['geolocation'])

newIssueApp.config(function($compileProvider) {

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});

newIssueApp.controller('NewIssueCtrl', function($scope, $rootScope, $state, Issue, IssueTypeService, $http, $log, qimgUrl, qimgToken, CameraService) {

	$rootScope.newmarkers = {}; // pas oublier de l'enlever!!!
	$scope.newIssue = {};

	$scope.$on('$ionicView.beforeEnter', function() {



		IssueTypeService.getIssuesType(function(error, issuesTypes) {
			if (error) {
				$scope.error = error;
			} else {

				$scope.issueTypes = issuesTypes;
				$scope.newIssue.issueTypeId = "";


			}
		});
	});



	for (var i = 0; i < $rootScope.newmarkers.length; i++) {

		if ($rootScope.newmarkers[i].id === "new") {

			$scope.newIssue.lat = $rootScope.newmarkers[i].lat;
			$scope.newIssue.lng = $rootScope.newmarkers[i].lng;

		};

	};



	$scope.saveIssue = function() {

		$log.debug($scope.newIssue);
		$log.debug($rootScope.tags);


		//	var newIssue = $scope.newIssue;

		// 		var callback = function(error, issue) {
		// 	if (error) {
		// 		$scope.error = error;
		// 	} else {

		// 		$state.go("tab.issueMapId", {
		// 			issueId: issue.id
		// 		});

		// 	}

		// };

		// Issue.post(callback, newIssue);

	};



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

newIssueApp.controller('ItemsController', function($scope,$rootScope, tags,$log) {
	$rootScope.tags = tags;

	$scope.deleteTag = function(index) {
		tags.data.splice(index, 1);
	}
	$scope.addTag = function(index) {

		tags.data.push(
			'"'+$scope.newTagName+'"'
		);
		$scope.newTagName = "";

	}

});


newIssueApp.factory("tags", function() {
	var tags = {};
	tags.data = [];
	return tags;
});

newIssueApp.factory("Issue", function($http, apiUrl) {
	return {
		post: function(callback, newIssue) {


			$http.post(apiUrl + "/issues", {


				"description": newIssue.desc,
				"lng": newIssue.lng,
				"lat": newIssue.lat,
				"imageUrl": "http://frc.ch/wp-content/uploads/2011/07/ete.jpg",
				"issueTypeId": newIssue.issueTypeId



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

newIssueApp.factory("IssueTag", function($http, apiUrl) {
	return {
		posttag: function(callback, issueId, tag) {

			$http.post(apiUrl + "/issues/" + issueId + "/actions", {
				"type": "addTags",
				"payload": {
					tags
				}
			}).success(function(data) {
				issue = data;

				callback(null, issue);
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