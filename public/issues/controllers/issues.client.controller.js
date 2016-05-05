angular.module('issues').controller('IssuesController',
  ['$scope', '$routeParams', '$location', 'Authentication', 'Issues', 'Entries',
    function($scope, $routeParams, $location, Authentication, Issues, Entries) {
      $scope.authentication = Authentication;
      $scope.year = 2016 // TODO: Defaults to current year
      $scope.issueNumber = 5 // TODO: Defaults to last issue
      // TODO: Translate season to portuguese
      $scope.seasons = {
        'Summer': 'verão',
        'Fall': 'outono',
        'Winter': 'inverno',
        'Spring': 'primavera'
      }

      $scope.articles = [{id: 'article1', titleEn: 'Entry 1', keywordsEn: [], keywordsPt: []}];
      $scope.addNewArticle = function() {
        var newArticleNo = $scope.articles.length+1;
        $scope.articles.push({'id':'article'+newArticleNo,
                              titleEn: 'Entry ' + newArticleNo,
                              keywordsEn: [], keywordsPt: []});
      }

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

      $scope.create = function() {
        // TODO: See whats up with img, pdf storage
        var newIssue = new Issues({
          issueNumber: this.issueNumber,
          notesEn: this.notesEn,
          season: this.season,
          year: this.year
        });

        // Attempt to save issue.
        newIssue.$save(function(response) {
          // If issue save succeeded, try to save each entry.
          for (var i=0; i < $scope.articles.length; i++) {
            entryData = $scope.articles[i];
            console.log(entryData);
            var entry = new Entries({
              author: entryData.author,
              type: entryData.type,
              titleEn: entryData.titleEn,
              titlePt: entryData.titlePt,
              issue: newIssue._id,
              abstractDescEn: entryData.abstractDescEn,
              abstractDescPt: entryData.abstractDescPt,
              keywordsEn: entryData.keywordsEn,
              keywordsPt: entryData.keywordsPt,
            });

            console.log(entry);
            entry.$save(function(response) {

            }, function(errorResponse) {
              // TODO: how to make the error show up there?
              console.log(errorResponse.data.message);
              $scope.error = errorResponse.data.message;
              // $location.path('issues/' + response._id + '/edit');
            })

            // All good!
            $location.path('issues/' + response._id);
          }

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
        $scope.entries = Entries.query({
          issue: $routeParams.issueId
        });

        //$scope.articles = 
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
          // Delete articles, then issue.
          for (var i=0; i<$scope.entries.length; i++) {
            $scope.entries[i].$remove()
          }
          $scope.issue.$remove(function() {
            $location.path('issues');
          });
        }
      };
    }
  ]
);
