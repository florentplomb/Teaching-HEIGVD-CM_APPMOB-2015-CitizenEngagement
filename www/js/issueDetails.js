var detailApp = angular.module('citizen-engagement.issueDetails', [])

detailApp.controller('DetailCtrl', function($scope, $stateParams, IssueByIdService, $state) {

	var issueId = $stateParams.issueId;

	$scope.goToIssueMap = function() {

		$state.go("tab.issueMapId", {
			issueId: $stateParams.issueId
		});
	};
	$scope.commentAdd = {};
	$scope.postComment = function() {
		var issueId = $stateParams.issueId;
		var callback = function(error, issue) {
			if (error) {
				$scope.error = error;
			} else {

				$scope.issue = issue;
				$scope.commentAdd.text = "";
			}

		};

		IssueByIdService.postComment(callback, issueId, $scope.commentAdd.text);
	};
	$scope.goList = function() {
		$state.go("tab.issueList");
	};

	$scope.custom = true;
	$scope.toggleCustom = function() {
		$scope.custom = $scope.custom === false ? true : false;
	};
	var callback = function(error, issues) {
		if (error) {
			$scope.error = error;
		} else {

			$scope.issue = issue;
		}
	};
	IssueByIdService.getIssue(callback, issueId);

});
detailApp.factory("IssueByIdService", function($http, apiUrl) {
	return {
		getIssue: function(callback, issueId) {
			$http.get(apiUrl + "/issues/" + issueId).success(function(data) {
				issue = data;

				callback(null, issue);
			}).error(function(error) {
				callback(error);
			});
		},
		postComment: function(callback, issueId, textComment) {

			$http.post(apiUrl + "/issues/" + issueId + "/actions", {
				"type": "comment",
				"payload": {
					"text": textComment
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