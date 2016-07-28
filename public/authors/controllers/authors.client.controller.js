angular.module('authors').controller('AuthorsController',
  ['$scope', '$mdDialog', '$routeParams', '$location', '$timeout', 'Upload', 'Authentication', 'Issues', 'Entries', 'Authors',
    function($scope, $mdDialog, $routeParams, $location, $timeout, Upload, Authentication, Issues, Entries, Authors) {
      $scope.authentication = Authentication;

      $scope.removeArticle = function(item) {
        $scope.articles.splice(item, 1);
      };

      $scope.toggleAbstract = function(index) {
        var abs = $(".abstract").eq(index);
        if (abs.css("display") == "none") {
          abs.css("display", "inherit");
        } else {
          abs.css("display", "none");
        }
      }

      $scope.create = function(redirect) {
        // TODO: See whats up with img, pdf storage
        var newAuthor = new Authors({
          name: this.name,
          bio: this.bio
        });

        // Attempt to save author.
        newAuthor.$save(function(authorResponse) {
          console.log(authorResponse)
          if (redirect) {
            $location.path('authors/' + authorResponse._id);
          }
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });

      };

      $scope.update = function() {
        $scope.issue.$update(function() {
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
          console.log($scope.error);
        });
      };


      $scope.find = function() {
        $scope.authors = Authors.query();
      };

      $scope.findOneNoEntries= function() {
        $scope.author = Authors.get({
          authorId: $routeParams.authorId
        }, function() {
        });
      };

      $scope.findOne = function() {
        $scope.author = Authors.get({
          authorId: $routeParams.authorId
        }, function() {
        });

        $scope.entries = Entries.query({
          author2: $routeParams.authorId
        }, function() {
          console.log($scope.entries)
        });
      };

      $scope.delete = function(author) {
        var confirm = $mdDialog.confirm()
          .title("Are you sure you want to delete this author?")
          .textContent("This action cannot be undone.")
          .ok("Yes, delete.")
          .cancel("No");
        $mdDialog.show(confirm).then(function() {
          if (author) {
            author.$remove(function() {
              for (var i in $scope.author) {
                if ($scope.authors[i] === author) {
                  $scope.authors.splice(i, 1);
                }
              }
            });
          } else {
            // Delete entries, then author.
            for (var i=0; i<$scope.entries.length; i++) {
              $scope.entries[i].$remove()
            }
            $scope.author.$remove(function() {
              $location.path('authors');
            });
          }
        }, function() {
          // Do nothing if user cancels delete
        });
      };

      $scope.checkEntry = function(type) {
        return function(entry) {
          return entry.type == type;
        }
      };
    }
  ]
);
