angular.module('entries').controller('EntriesController',
  ['$scope', '$mdDialog', '$routeParams', '$location', 'Authentication', 'Entries',
    function($scope, $mdDialog, $routeParams, $location, Authentication, Entries) {
      $scope.authentication = Authentication;
      $scope.keywordsEn = [];
      $scope.keywordsPt = [];
      $scope.issue = 1; // TODO: default to last issue created

      $scope.toggleAbstract = function(index) {
        var abs = $(".abstract").eq(index);
        if (abs.css("display") == "none") {
          abs.css("display", "inherit");
        } else {
          abs.css("display", "none");
        }
      }

      $scope.create = function() {
        // TODO: See whats up with img, pdf storage
        var entry = new Entries({
          author: this.author,
          titleEn: this.titleEn,
          titlePt: this.titlePt,
          type: this.type,
          issue: this.issue,
          abstractDesc: this.abstractDesc,
          keywordsPt: $scope.keywordsPt,
          keywordsEn: $scope.keywordsEn
        });

        entry.$save(function(response) {
          $location.path('entries/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.find = function() {
        // Hack, but it works!
        $scope.title = $location.search().type + 's';

        $scope.entries = Entries.query($location.search());
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
        var confirm = $mdDialog.confirm()
          .title("Are you sure you want to delete this issue?")
          .textContent("This action cannot be undone.")
          .ok("Yes, delete.")
          .cancel("No");
        $mdDialog.show(confirm).then(function() {
          if (entry) {
            entry.$remove(function() {
              for (var i in $scope.entries) {
                if ($scope.entries[i] === entry) {
                  $scope.entries.splice(i, 1);
                }
              }
            });
          } else {
            console.log($scope.entry);
            $scope.entry.$remove(function() {
              $location.path('entries');
            });
          }
        }, function() {});
      };
    }
  ]
);
