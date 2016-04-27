angular.module('issues').controller('IssuesController',
  ['$scope', '$routeParams', '$location', 'Authentication', 'Issues',
    function($scope, $routeParams, $location, Authentication, Issues) {
      $scope.authentication = Authentication;

      $scope.create = function() {
        // TODO: See whats up with img, pdf storage
        var issue = new Issues({
          issueNumber: this.issueNumber,
          notes: this.notes,
          season: this.season,
          year: this.year
        });

        issue.$save(function(response) {
          $location.path('issues/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.find = function() {
        $scope.issues = Issues.query();
      };

      $scope.findOne = function() {
        $scope.issue = Issues.get({
          issueId: $routeParams.issueId
        });
      };

      $scope.update = function() {
        $scope.issue.$update(function() {
          $location.path('issues/' + $scope.issue._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.delete = function(issue) {
        if (issue) {
          issue.$remove(function() {
            for (var i in $scope.issues) {
              if ($scope.issues[i] === issue) {
                $scope.issues.splice(i, 1);
              }
            }
          });
        } else {
          $scope.issue.$remove(function() {
            $location.path('issues');
          });
        }
      };
    }
  ]
);
