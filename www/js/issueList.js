var list = angular.module('citizen-engagement.issueList', [])


list.controller('ListCtrl', function($scope, IssueServiceList,$state) {

	$scope.$on('$ionicView.beforeEnter', function() {


		var callback = function(error, issues) {
			if (error) {
				$scope.error = error;
			} else {
				$scope.issues = issues;
			}
		};

		IssueServiceList.getIssues(callback);

		IssueServiceList.getIssuesType(function(error, issuesTypes) {
			if (error) {
				$scope.error = error;
			} else {

				$scope.issueTypes = issuesTypes;
				$scope.filter.type = issuesTypes[0].id;
			}
		});

	});

	$scope.query = {};
	$scope.queryBy = '$';
	$scope.filter = {};
	$scope.custom = true;

	$scope.goToIssueDetails = function(issue) {
		$state.go("tab.issueDetails", {
			issueId: issue.id
		});
	};



	$scope.toggleCustom = function() {
		$scope.custom = $scope.custom === false ? true : false;
	};
});

list.factory("IssueServiceList", function($http, apiUrl) {
	return {
		getIssues: function(callback) {
			$http.get(apiUrl + "/issues").success(function(data) {
				issues = data;

				callback(null, issues);
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
		}
	};
});

