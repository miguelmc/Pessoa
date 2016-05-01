angular.module('issues').controller('IssuesController',
  ['$scope', '$routeParams', '$location', 'Authentication', 'Issues',
    function($scope, $routeParams, $location, Authentication, Issues) {
      $scope.authentication = Authentication;
      $scope.year = 2016 // TODO: Defaults to current year
      $scope.issueNumber = 5 // TODO: Defaults to last issue
      // TODO: Translate season to portuguese

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


      $scope.create = function() {
        console.log($scope.articles);
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
