var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])


mapApp.controller("MapController", function($log, $scope, IssueService, $stateParams, mapboxMapId, mapboxAccessToken, geolocation, $state) {

    $scope.mapConfig = {};
    $scope.mapConfig.markers = [];
    $scope.mapConfig.center = {};

    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };


    $scope.$on('$ionicView.beforeEnter', function() {

        $scope.mapConfig.center = {
            lat: 46.7833,
            lng: 6.65,
            zoom: 14
        };

        IssueService.getIssues(function(error, issues) {
            if (error) {
                $scope.error = error;
            } else {

                $scope.issues = issues;

                function createMarkerScope(issue) {
                    return function() {
                        var scope = $scope.$new();
                        scope.issue = issue;
                        return scope;

                    };
                }

                for (var i = 0; i < issues.length; i++) {
                    var issue = issues[i];
                    $scope.mapConfig.markers.push({
                        issueId: issue.id,
                        lat: issue.lat,
                        lng: issue.lng,
                        icon: {},
                        message: '<div ng-click=test("' + issue.id + '")><p>{{issue.description}}<a href="">Details</a></p></div>',
                        getMessageScope: createMarkerScope(issue)

                    });

                }

                if ($stateParams.issueId) {

                    var issueId = $stateParams.issueId;

                    IssueService.getIssueId(function(error, issue) {
                        if (error) {
                            $scope.error = error;
                        } else {
                            $scope.mapConfig.center = {
                                lat: issue.lat,
                                lng: issue.lng,
                                zoom: 18
                            };



                        }
                    }, issueId);



                    for (var i = 0; i < $scope.mapConfig.markers.length; i++) {

                        if ($scope.mapConfig.markers[i].issueId == issueId) {
                            $scope.mapConfig.markers[i].icon = {
                                iconUrl: '../img/green.png'
                                    // iconSize:     [38, 95],
                            };

                        };


                    }



                } else {

                    geolocation.getLocation().then(function(data) {
                        $scope.mapConfig.center.lat = data.coords.latitude;
                        $scope.mapConfig.center.lng = data.coords.longitude;
                        $scope.mapConfig.center.zoom = 14;
                        $scope.mapConfig.markers.push({
                            lat: data.coords.latitude,
                            lng: data.coords.longitude,
                            icon: {
                                iconUrl: '../img/redicon.png',
                                iconSize: [30, 40]
                            },
                        });
                    }, function(error) {
                        $log.error("Could not get location: " + error);
                        $scope.mapConfig.center = {
                            lat: 46.7833,
                            lng: 6.65,
                            zoom: 14
                        };

                    });
                };



            }

        });

    });



    if ($stateParams.addMarker) {

        $scope.events = {};

        alert("hey");
        $scope.$on("leafletDirectiveMap.click", function(event, args) {
            var leafEvent = args.leafletEvent;
            $scope.mapConfig.markers.push({
                type: 'awesomeMarker',
                icon: 'tag',
                markerColor: 'red',
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                message: "My Added Marker"
            });
        });


    }

    $scope.test = function(issueId) {

                alert(issueId);
                $state.go("tab.issueDetails", {
            issueId: issueId
        });
                 alert(issueId);

    }

    $scope.location = function() {

        geolocation.getLocation().then(function(data) {
            $scope.mapConfig.center.lat = data.coords.latitude;
            $scope.mapConfig.center.lng = data.coords.longitude;
            $scope.mapConfig.center.zoom = 14;
            $scope.mapConfig.markers.push({
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                icon: {
                    iconUrl: '../img/redicon.png',
                    iconSize: [30, 40]
                },
            });
        }, function(error) {
            $log.error("Could not get location: " + error);
            $scope.mapConfig.center = {
                lat: 46.7833,
                lng: 6.65,
                zoom: 14
            };

        });

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
                alert(issue);
                issue = data;
                callback(null,issue);
            }).error(function(error) {
                callback(error);
            });


        }


    };

});