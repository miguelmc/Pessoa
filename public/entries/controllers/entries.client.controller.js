angular.module('entries').controller('EntriesController',
  ['$scope', '$routeParams', '$location', 'Authentication', 'Entries',
    function($scope, $routeParams, $location, Authentication, Entries) {
      $scope.authentication = Authentication;

      $scope.create = function() {
        // TODO: See whats up with img, pdf storage
        var entry = new Entries({
          author: this.author,
          titleEn: this.titleEn,
          titlePt: this.titlePt,
          type: this.type,
          issue: this.issue
        });

        entry.$save(function(response) {
          $location.path('entries/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.find = function() {
        $scope.entries = Entries.query();
      };

      $scope.findOne = function() {
        $scope.entry = Entries.get({
          entryId: $routeParams.entryId
        });
      };

      $scope.update = function() {
        $scope.entry.$update(function() {
          $location.path('entries/' + $scope.entry._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.delete = function(entry) {
        if (entry) {
          entry.$remove(function() {
            for (var i in $scope.entries) {
              if ($scope.entries[i] === entry) {
                $scope.entries.splice(i, 1);
              }
            }
          });
        } else {
          $scope.entry.$remove(function() {
            $location.path('entries');
          });
        }
      };
    }
  ]
);
