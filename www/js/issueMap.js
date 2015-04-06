var mapApp = angular.module('citizen-engagement.issueMap', ["leaflet-directive", 'geolocation'])

mapApp.controller("MapController", function($log, $scope, $rootScope, IssueService,img,$ionicPlatform,$cordovaGeolocation, $stateParams, leafletData, mapboxMapId, mapboxAccessToken, geolocation, $state) {


    var locYverdon = {
        lat: 46.7833,
        lng: 6.65,
        zoom: 14
    };

    var myPosition = {
        iconUrl: img+"/redicon.png",
        iconSize: [34, 39],
        iconAnchor: [14, 40]
    };
    var myMarker = {
        iconUrl: img+'/green.png',
        iconSize: [25, 41],
        iconAnchor: [11, 15]
    };
    var markerOrange = {
        iconUrl: img+'/orange.png',
        iconSize: [25, 41],
        iconAnchor: [11, 15]
    };

    $scope.loc = {};
    $scope.events = {};
    $scope.mapConfig = {};
    $scope.mapConfig.markers = [];
    $scope.mapConfig.center = {};
    $rootScope.newmarkers = [];
    $scope.custom = false;
    $scope.declenche = true;
    $scope.validate = true;
    $scope.mapConfig.center = {};
    var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + "cleliapanchaud.kajpf86n";
    mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + "pk.eyJ1IjoiY2xlbGlhcGFuY2hhdWQiLCJhIjoiM2hMOEVXYyJ9.olp7FrLzmzSadE07IY8OMQ";
    $scope.mapDefaults = {
        tileLayer: mapboxTileLayer
    };

    leafletData.getMap().then(function(map) {
        if (map._controlCorners.topright.childElementCount === 0) {
            L.control.locate({
                position: 'topright',
                icon: 'fa fa-map-marker  fa-dot-circle-o', // class for icon, fa-location-arrow or fa-map-marker
                iconLoading: 'fa fa-spinner fa-spin',

            }).addTo(map);
        }
    });

    $scope.$on('$ionicView.beforeEnter', function() {

        $scope.mapConfig.markers = [];
        $rootScope.newmarkers = [];
        $scope.custom = false;
        $scope.declenche = true;
        $scope.validate = true;

        $scope.mapConfig.center = locYverdon
        IssueService.getIssues(function(error, issues) {
            if (error) {
                $scope.error = error;
            } else {


                $scope.issues = issues;

                angular.forEach(issues, function(issue) {

                    $scope.mapConfig.markers.push({
                        lat: parseFloat(issue.lat),
                        lng: parseFloat(issue.lng),
                        id: issue.id,
                        message: '<div ng-click="goDetail(issue.id)"><p>{{issue.description}}</p><img src="{{issue.imageUrl}}" width="100px" /><a style="display:block;" id="popuplf class="button icon-right ion-android-arrow-dropright">Details</a></div>',
                        getMessageScope: function() {
                            var scope = $scope.$new();
                            scope.issue = issue;
                            return scope;
                        }

                    });

                })
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
    });

    $scope.goDetail = function(issueId) {

        $state.go("tab.issueDetails", {
            issueId: issueId
        });
    };

    $scope.goNew = function() {
        alert("J'aimerais aller sur la page NewIssue");

        $state.go("tab.newIssue");
    };

    $scope.location = function() {
        $scope.mapConfig.center.lat = $scope.loc.coords.latitude;
        $scope.mapConfig.center.lng = $scope.loc.coords.longitude;
        $scope.mapConfig.center.zoom = 14;
    };

    $scope.addIssue = function() {
         $scope.custom = $scope.declenche = false;
        $scope.custom = $scope.custom === false ? true : false;
        var cpt = 0;
        $scope.$on("leafletDirectiveMap.click", function(event, args) {
            if (cpt < 1) {
                $scope.declenche = true;
                $scope.custom = true;
                $scope.validate = false;
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

$ionicPlatform.ready(function()
{

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
     var markertop = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        icon: myPosition
    };
    $scope.mapConfig.mapCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        zoom: 14
    };
     $scope.mapConfig.markers.push(markertop);
    }, function(err) {
      // error
    });

});

});


mapApp.factory("IssueService", function($http, apiUrl) {

    var config = {
        headers: {
            'x-pagination': '*'
        }
    };
    return {
        getIssues: function(callback) {
            $http.get(apiUrl + "/issues", config).success(function(data) {
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

mapApp.factory('$cordovaGeolocation', ['$q', function ($q) {

    return {
      getCurrentPosition: function (options) {
        var q = $q.defer();

        navigator.geolocation.getCurrentPosition(function (result) {
          q.resolve(result);
        }, function (err) {
          q.reject(err);
        }, options);

        return q.promise;
      },

      watchPosition: function (options) {
        var q = $q.defer();

        var watchID = navigator.geolocation.watchPosition(function (result) {
          q.notify(result);
        }, function (err) {
          q.reject(err);
        }, options);

        q.promise.cancel = function () {
          navigator.geolocation.clearWatch(watchID);
        };

        q.promise.clearWatch = function (id) {
          navigator.geolocation.clearWatch(id || watchID);
        };

        q.promise.watchID = watchID;

        return q.promise;
      },

      clearWatch: function (watchID) {
        return navigator.geolocation.clearWatch(watchID);
      }
    };
  }]);