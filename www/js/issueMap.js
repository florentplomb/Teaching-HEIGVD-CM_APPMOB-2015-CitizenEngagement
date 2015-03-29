var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])


mapApp.controller("MapController", function($log, $scope, $rootScope, IssueService, $stateParams, mapboxMapId, mapboxAccessToken, geolocation, $state) {

    var locYverdon = {
        lat: 46.7833,
        lng: 6.65,
        zoom: 14
    };
    $scope.events = {};
    $scope.mapConfig = {};
    $scope.mapConfig.markers = [];
    $scope.mapConfig.center = {};
    $rootScope.newmarkers = [];

    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };

    $scope.custom = true;




    $scope.$on('$ionicView.beforeEnter', function() {

        $scope.mapConfig.center = locYverdon

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
                        id: issue.id,
                        lat: issue.lat,
                        lng: issue.lng,
                        opacity: 1,
                        icon: {},
                        message: '<div ng-click=goDetail("' + issue.id + '")><p>{{issue.description}}<a href="">Details</a></p></div>',
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

                            };

                        };


                    }

                }

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
                        id: "me"
                    });
                }, function(error) {
                    $log.error("Could not get location: " + error);
                    $scope.mapConfig.center = locYverdon;

                });



            }

        });

    });



    $scope.goDetail = function(issueId) {

        $state.go("tab.issueDetails", {
            issueId: issueId
        });


    };



    $scope.location = function() {

        geolocation.getLocation().then(function(data) {
            $scope.mapConfig.center.lat = data.coords.latitude;
            $scope.mapConfig.center.lng = data.coords.longitude;
            $scope.mapConfig.center.zoom = 14;
            $scope.mapConfig.markers.push({
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                opacity: 1,
                icon: {
                    iconUrl: '../img/redicon.png',
                    iconSize: [30, 40]
                },
                id: "me"
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

    $scope.addIssue = function() {

           $scope.custom = $scope.custom === false ? true : false;

        // for (var i = 0; i < $scope.mapConfig.markers.length; i++) {

        //     $scope.mapConfig.markers[i].opacity = 0 ;

        // }

        geolocation.getLocation().then(function(data) {
            $scope.mapConfig.center.lat = data.coords.latitude;
            $scope.mapConfig.center.lng = data.coords.longitude;
            $scope.mapConfig.center.zoom = 14;
            $scope.mapConfig.markers.push({
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                opacity: 1,
                icon: {
                    iconUrl: '../img/redicon.png',
                    iconSize: [30, 40]
                },
                id: "me"
            });
        });


        $scope.mapConfig.markers = [];

        var cpt = 0;

        $scope.$on("leafletDirectiveMap.click", function(event, args) {

            if (cpt < 1) {

                var leafEvent = args.leafletEvent;
                $scope.mapConfig.markers.push({
                    lat: leafEvent.latlng.lat,
                    lng: leafEvent.latlng.lng,
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
                alert(issue);
                issue = data;
                callback(null, issue);
            }).error(function(error) {
                callback(error);
            });


        }


    };

});