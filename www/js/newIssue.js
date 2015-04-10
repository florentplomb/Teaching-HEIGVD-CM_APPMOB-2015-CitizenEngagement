var newIssueApp = angular.module('citizen-engagement.newIssue', ['geolocation'])

newIssueApp.config(function($compileProvider) {

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

});

newIssueApp.controller('NewIssueCtrl', function($scope, $timeout, $rootScope, $state, tags, IssueServiceBD, $http, $log, qimgUrl, qimgToken, CameraService) {

	var markerOrange = {
		iconUrl: 'img/orange.png',
		iconSize: [25, 41],
		iconAnchor: [11, 15]
	};
	$scope.newIssue = {};
	$scope.mapConfig = {};
	$scope.mapConfig.markers = [];
	$scope.mapConfig.center = {};

	$scope.$on('$ionicView.beforeEnter', function() {
		tags.data = [];
		$scope.mapConfig.center = {};
		$scope.newIssue = {};
		$timeout(function() {
			$scope.$broadcast('invalidateSize');

		});
		IssueServiceBD.getIssuesType(function(error, issuesTypes) {
			if (error) {
				$scope.error = error;
			} else {

				$scope.issueTypes = issuesTypes;
				$scope.newIssue.issueTypeId = "";
			}
		});

		for (var i = 0; i < $rootScope.newmarkers.length; i++) {

			if ($rootScope.newmarkers[i].id === "new") {

				$scope.newIssue.lat = $rootScope.newmarkers[i].lat;
				$scope.newIssue.lng = $rootScope.newmarkers[i].lng;
			};
		};
		var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
		mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
		$scope.mapDefaults = {
			tileLayer: mapboxTileLayer,
			zoomControl: false
		};
		$scope.mapConfig = {};
		$scope.mapConfig.markers = [];
		$scope.mapConfig.center = {};
		$scope.mapConfig.center = {
			lat: $scope.newIssue.lat,
			lng: $scope.newIssue.lng,
			zoom: 17
		}
		$scope.mapConfig.markers.push({
			id: "new",
			icon: markerOrange,
			focus: true,
			lat: $scope.newIssue.lat,
			lng: $scope.newIssue.lng,
			draggable: true,
			message: "Hey, drag me if you want"
		});
	});

	$scope.saveIssue = function() {

		var newIssue = $scope.newIssue;
		var callback = function(error, issue) {
			if (error) {
				$scope.error = error;
			} else {
				var callbacktag = function(error, issuetag) {
					if (error) {
						$scope.error = error;
					} else {
						console.log("Tag posted");
					}
				}
				console.log(tags.data);
				IssueServiceBD.postTag(callbacktag, issue.id, tags.data);

			};

			$state.go("tab.issueMapId", {
				issueId: issue.id
			});

		};
		IssueServiceBD.post(callback, newIssue);
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
				$scope.newIssue.photo = data.url;

			});
		}, function(err) {
			alert("erorr" + err);

			$scope.error = err;
		});

	};
	$scope.goMap = function() {
		$state.go("tab.issueMap");
	};
});

newIssueApp.controller('TagsController', function($scope, $rootScope, tags, $log) {

	$scope.tags = tags;

	$scope.deleteTag = function(index) {
		tags.data.splice(index, 1);
	}
	$scope.addTag = function(index) {

		tags.data.push(
			$scope.newTagName
		);
		$scope.newTagName = "";

	}
});

newIssueApp.factory("tags", function() {
	var tags = {};
	tags.data = [];
	return tags;
});

newIssueApp.factory("IssueServiceBD", function($http, apiUrl) {
	return {
		post: function(callback, newIssue) {

			$http.post(apiUrl + "/issues", {
				"description": newIssue.desc,
				"lng": newIssue.lng,
				"lat": newIssue.lat,
				"imageUrl": newIssue.photo,
				"issueTypeId": newIssue.issueTypeId
			}).success(function(data) {
				issue = data;

				callback(null, issue);
			}).error(function(error) {
				callback(error);
			});
		},
		getIssuesType: function(callback) {
			$http.get(apiUrl + "/issueTypes").success(function(data) {
				issueType = data;
				callback(null, issueType);
			}).error(function(error) {
				callback(error);
			});
		},
		postTag: function(callback, issueId, tag) {

			$http.post(apiUrl + "/issues/" + issueId + "/actions", {
				"type": "addTags",
				"payload": {
					"tags": tag
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