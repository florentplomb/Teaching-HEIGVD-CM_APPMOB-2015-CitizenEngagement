var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])


mapApp.controller("MapController", function($log, $scope, $rootScope, IssueService, $stateParams, mapboxMapId, mapboxAccessToken, geolocation, $state) {


    $scope.loc = {};
    $scope.events = {};
    $scope.mapConfig = {};
    console.log("he suis");
    $scope.mapConfig.markers = [];
    $scope.mapConfig.center = {};
    $rootScope.newmarkers = [];
    $scope.custom = true;
    $scope.declenche = false;

    var locYverdon = {
        lat: 46.7833,
        lng: 6.65,
        zoom: 14
    };

    var myPosition = {
        iconUrl: '../img/redicon.png',
        iconSize: [30, 46],
        iconAnchor: [15, 46]
    };
    var myMarker = {
        iconUrl: '../img/isscone.png',
        iconSize: [45, 45],
        iconAnchor: [30, 50]
    };
    var markerOrange = {
        iconUrl: '../img/orange.png',
        iconSize: [25, 41],
        iconAnchor: [11,15]
    };
    var timeError = 2000;

    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };

    geolocation.getLocation().then(function(data) {
        $scope.loc = data
        $scope.mapConfig.markers.push({
            lat: data.coords.latitude,
            lng: data.coords.longitude,
            icon: {
                iconUrl: '../img/redicon.png',
                iconSize: [30, 40]
            },
            id: "me"
        });
    }, function(error) {

        $log.error("Could not get location: " + error);


    });

    $scope.mapConfig.center = locYverdon

    IssueService.getIssues(function(error, issues) {
        if (error) {
            $scope.error = error;
        } else {

            $scope.issues = issues;


            for (var i in issues) {
                var issue = issues[i];
                $scope.mapConfig.markers.push({
                    lat: parseFloat(issue.lat),
                    lng: parseFloat(issue.lng),
                    id: issue.id,
                    message: '<div ng-click=goDetail("' + issue.id + '")><p>{{issue.description}}<a href="">Details</a></p></div>',
                });

            }
        }


        if ($stateParams.issueId) {

            var issueId = $stateParams.issueId;


            function find(array, attr, value) {

                for (var i = 0; i < array.length; i++) {

                    if (array[i].id === value) {
                        return array[i];
                    }

                }

            }

            markers = $scope.mapConfig.markers;
            var markersFocus = find(markers, "id", issueId);

            markersFocus.icon = myMarker;
            $scope.mapConfig.center = {
                lat: markersFocus.lat,
                lng: markersFocus.lng,
                zoom: 18
            }
        }

    });



    $scope.goDetail = function(issueId) {

        $state.go("tab.issueDetails", {
            issueId: issueId
        });


    };



    $scope.location = function() {


            $scope.mapConfig.center.lat =  $scope.loc.coords.latitude;
            $scope.mapConfig.center.lng =  $scope.loc.coords.longitude;
            $scope.mapConfig.center.zoom = 14;



    };

    $scope.addIssue = function() {

        $scope.custom = $scope.custom === false ? true : false;


    //    $scope.mapConfig.markers = [];

        var cpt = 0;

        $scope.$on("leafletDirectiveMap.click", function(event, args) {


             console.log($scope.declenche);


            if (cpt < 1) {

                $scope.declenche = true;
                $scope.custom = false;
                console.log($scope.declenche);
                var leafEvent = args.leafletEvent;
                $scope.mapConfig.markers.push({
                    lat: leafEvent.latlng.lat,
                    lng: leafEvent.latlng.lng,
                    icon: markerOrange,
                    draggable: true,
                    id: "new",
                    message: "Hey, drag me if you want",

                });
                cpt++;

            }



        });

        $rootScope.newmarkers = $scope.mapConfig.markers;

    };



});



mapApp.factory("IssueService", function($http, apiUrl) {
    return {
        getIssues: function(callback) {
            $http.get(apiUrl + "/issues").success(function(data) {
                issues = data;
                callback(null, issues);
            }).error(function(error) {
                callback(error);
            });
        },
        getIssueId: function(callback, issueId) {
            $http.get(apiUrl + "/issues/" + issueId).success(function(data) {

                issue = data;
                callback(null, issue);
            }).error(function(error) {
                callback(error);
            });


        }


    };

});