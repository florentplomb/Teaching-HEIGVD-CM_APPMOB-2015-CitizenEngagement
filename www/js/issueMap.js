var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])


mapApp.controller("MapController", function($log, $scope, IssueService, $stateParams, mapboxMapId, mapboxAccessToken, geolocation,$state) {

    $scope.mapConfig = {};
    $scope.mapConfig.markers = [];
    $scope.mapConfig.center = {};


    $scope.$on('$ionicView.beforeEnter', function() {

                       $scope.mapConfig.center = {
                    lat: 46.7833,
                    lng: 6.65,
                    zoom: 14
                }; 


        if ($stateParams.issueId) {
            var issueId = $stateParams.issueId;

            var callback = function(error, issue) {
                if (error) {
                    $scope.error = error;
                } else {
                    $scope.mapConfig.center = {
                        lat: issue.lat,
                        lng: issue.lng,
                        zoom: 18

                    };
                    for (var i = 0; i < $scope.mapConfig.markers.length; i++) {
                        $scope.mapConfig.markers[i].icon = {
                            iconUrl: 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/256/Map-Marker-Marker-Outside-Chartreuse-icon.png',
                            iconSize: [38, 95]
                        };

                    }


                }
            };

            IssueService.getIssueId(callback, issueId);

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
    });
 $scope.test = function(issueId){
    $state.go("tab.issueDetails", { issueId: issueId });
    

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



    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
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
                    // icon:{
                    //  iconUrl: '../img/ionic.png',
                    //  iconSize:[38, 95] },           
                    message: '<div ng-click=test("'+issue.id+'")><p>{{issue.description}}<a href="">Details</a></p></div>' ,
                    getMessageScope: createMarkerScope(issue)

                });

            }

        }

    });

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