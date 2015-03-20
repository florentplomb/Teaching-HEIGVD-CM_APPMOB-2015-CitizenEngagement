
var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])


mapApp.controller("MapController", function ($log, $scope, IssueService, $stateParams, mapboxMapId, mapboxAccessToken, geolocation) {

    $scope.mapConfig ={};
    $scope.mapConfig.markers = [];
    $scope.mapConfig.center = {};

    $scope.location = function () {             // J'ai toujours l'alerte mais la mise à jour du scopeMapCondif se fait uniquement quand je suis
                                                // sur mon url de map avec paramètre (..tab/issueMap?issueId=550193b1bc9fca0e0060fe1e) , si je suis 
                                                // sur l'url (..tab/issueMap) l'alerte s'affiche mais ça ne me centre par sur le point :(

        alert("bouton localisation");

        $scope.mapConfig.center = {
            lat: 46.7833,
            lng: 6.65,
            zoom: 14};

    };

  
    $scope.$on('$ionicView.beforeEnter', function () {
    

   

        if ($stateParams.issueId) {
            var issueId = $stateParams.issueId;

            var callback = function (error, issue) {
                if (error) {
                    $scope.error = error;
                } else {
                    $scope.mapConfig.center = {
                        lat: issue.lat,
                        lng: issue.lng,
                        zoom: 18

                    };
                    for (var i = 0; i < $scope.mapConfig.markers.length; i++) {

                        alert("hey");
                        $scope.mapConfig.markers[i].icon = {
                            iconUrl: '../img/redicon.png',
                            iconSize: [38, 95]
                        };

                    }


                }
            };

            IssueService.getIssueId(callback, issueId);

        } else {
            $scope.mapConfig.center = {
                lat: 46.7833,
                lng: 6.65,
                zoom: 14
            };
            geolocation.getLocation().then(function (data) {
                $scope.mapConfig.center.lat = data.coords.latitude;
                $scope.mapConfig.center.lng = data.coords.longitude;
                $scope.mapConfig.center.zoom = 14;
                $scope.mapConfig.markers.push({
                    lat: data.coords.latitude,
                    lng: data.coords.longitude,
                    icon: {
                        iconUrl: '../img/redicon.png',
                        iconSize: [30, 40]},
                });
            }, function (error) {
                $log.error("Could not get location: " + error);
                $scope.mapConfig.center = {
                    lat: 46.7833,
                    lng: 6.65,
                    zoom: 14
                };

            });
        };
    });
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };
    IssueService.getIssues(function (error, issues) {
        if (error) {
            $scope.error = error;
        } else {

            $scope.issues = issues;


            function createMarkerScope(issue) {
                return function () {
                    var scope = $scope.$new();
                    scope.issue = issue;
                    return scope;
                };
            }


            for (var i = 0; i < issues.length; i++) {
                var issue = issues[i];
                //console.log(issue);

                $scope.mapConfig.markers.push({
                    issueId: issue.id,
                    lat: issue.lat,
                    lng: issue.lng,
                    // icon:{
                    //  iconUrl: '../img/ionic.png',
                    //  iconSize:[38, 95] },           
                    message: '<div ng-click="test()"><p>{{issue.description}}</p></div> ',
                    getMessageScope: createMarkerScope(issue)

                });

            }

        }

    });

});



mapApp.factory("IssueService", function ($http, apiUrl) {
    return {
        getIssues: function (callback) {
            $http.get(apiUrl + "/issues").success(function (data) {
                issues = data;

                callback(null, issues);
            }).error(function (error) {
                callback(error);
            });
        },
        getIssueId: function (callback, issueId) {
            $http.get(apiUrl + "/issues/" + issueId).success(function (data) {
                issue = data;

                callback(null, issue);
            }).error(function (error) {
                callback(error);
            });


        }


    };

});




