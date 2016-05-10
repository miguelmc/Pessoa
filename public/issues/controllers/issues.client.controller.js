angular.module('issues').controller('IssuesController',
  ['$scope', '$mdDialog', '$routeParams', '$location', '$timeout', 'Upload', 'Authentication', 'Issues', 'Entries',
    function($scope, $mdDialog, $routeParams, $location, $timeout, Upload, Authentication, Issues, Entries) {
      $scope.authentication = Authentication;
      $scope.year = (new Date()).getFullYear();
      $scope.issueNumber = 5 // TODO: Defaults to last issue
      $scope.seasons = {
        'Summer': 'verão',
        'Fall': 'outono',
        'Winter': 'inverno',
        'Spring': 'primavera'
      }

      // $scope.images= [];

      $scope.articles = [{id: 'article1', titleEn: 'Entry 1', keywordsEn: [], keywordsPt: []}];
      $scope.addNewArticle = function() {
        var newArticleNo = $scope.articles.length+1;
        $scope.articles.push({'id':'article'+newArticleNo,
                              titleEn: 'Entry ' + newArticleNo,
                              keywordsEn: [], keywordsPt: []});
      }

      $scope.addIssuePdf = function(files, errFiles) {
        $scope.pdf = files[0];
        $scope.errFiles= errFiles;
      }
      $scope.addEntryPdf = function(entry, files, errFiles) {
        entry.pdf = files[0];
        entry.errFiles= errFiles;
      }

      $scope.uploadPdf = function(model, pdf) {
        if (!pdf) return;
        // issuePdf = $scope.pdf;
        pdf.upload = Upload.upload({
            url: 'file',
            data: {file: pdf}
        });

        pdf.upload.then(function (response) {
            $timeout(function () {
                pdf.result = response.data;
                model.pdf = pdf.result;
                model.$update();
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            pdf.progress = Math.min(100, parseInt(100.0 * 
                                    evt.loaded / evt.total));
        });
      }
      
      /*
      $scope.uploadPdfs = function(issue, entries) {
        console.log(entries);
        issuePdf = $scope.pdf;
        issuePdf.upload = Upload.upload({
            url: 'file',
            data: {file: issuePdf}
        });

        issuePdf.upload.then(function (response) {
            $timeout(function () {
                issuePdf.result = response.data;
                issue.pdf = issuePdf.result;
                issue.$update();
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            issuePdf.progress = Math.min(100, parseInt(100.0 * 
                                    evt.loaded / evt.total));
        });

        angular.forEach(entries, function(entry) {
          console.log("-----------");
          console.log(entry);
          entryPdf = entry.pdf;
          entryPdf.upload = Upload.upload({
              url: 'file',
              data: {file: entryPdf}
          });

          entryPdf.upload.then(function (response) {
              $timeout(function () {
                  entryPdf.result = response.data;
                  entry.pdf = entryPdf.result;
                  entry.$update();
              });
          }, function (response) {
              if (response.status > 0)
                  $article.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
              entryPdf.progress = Math.min(100, parseInt(100.0 * 
                                      evt.loaded / evt.total));
          });
        });


      }*/

      $scope.addImages = function(entry, imageFiles, errFiles) {
        entry.imageFiles = imageFiles;
        entry.errFiles = errFiles;
      }

      $scope.uploadImages = function(entry, imageFiles/*files, errFiles*/) {
        
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log(entry);
        console.log(imageFiles);
        
        entry.images = []
        angular.forEach(imageFiles, function(file) {
            file.upload = Upload.upload({
                url: 'file',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    entry.images.push(file.result);

                    // This should be true only once on the last iteration completion.
                    if (entry.images.length == imageFiles.length) {
                      entry.$update();
                    }
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                        evt.loaded / evt.total));
            });
        });

        $scope.waitForImagesAndSave(entry, imageFiles.length);
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
          $scope.uploadPdf(newIssue, $scope.pdf);
          // If issue save succeeded, try to save each entry.
          newEntries = []
          for (var i=0; i < $scope.articles.length; i++) {
            entryData = $scope.articles[i];
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
              // newEntries.push(entry);
              console.log(entryData);
              $scope.uploadPdf(entry, entryData.pdf);
              $scope.uploadImages(entry, entryData.imageFiles);

            }, function(errorResponse) {
              // TODO: how to make the error show up there?
              console.log(errorResponse.data.message);
              $scope.error = errorResponse.data.message;
              // $location.path('issues/' + response._id + '/edit');
            })

          }


          // All good!
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
        }, function() {
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
        var confirm = $mdDialog.confirm()
          .title("Are you sure you want to delete this issue?")
          .textContent("This action cannot be undone.")
          .ok("Yes, delete.")
          .cancel("No");
        $mdDialog.show(confirm).then(function() {
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
        }, function() {
          // Do nothing if user cancels delete
        });
      };
    }
  ]
);
