
	var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])



	mapApp.controller("MapController", function($log, $scope, mapboxMapId, mapboxAccessToken, geolocation) {

	var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
	mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
		$scope.mapDefaults = {
		 tileLayer: mapboxTileLayer
		 };

		$scope.mapCenter = {
			lat: 46.7833,
			lng: 6.65,
			zoom: 14
		};

		geolocation.getLocation().then(function(data) {
			$scope.mapCenter.lat = data.coords.latitude;
			$scope.mapCenter.lng = data.coords.longitude;
		}, function(error) {
			$log.error("Could not get location: " + error);
		});

	 	 
	 	 $scope.mapMarkers = [];
		 //var issue = IssueService.getIssue();
	/* 	 $scope.mapMarkers.push({
			lat: issue.lat,
			lng: issue.lng,
	 		message: '<p>{{ issue.description }}</p><img src="{{ issue.imageUrl }}" width="200px" />',
	 			getMessageScope: function() {
		 var scope = $scope.$new();
		 //scope.issue = issue;
		 return scope;
		}
	 	});*/ 
	});


	  



