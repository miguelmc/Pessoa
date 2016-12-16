angular.module('issues').controller('IssuesController',
  ['$scope', '$mdDialog', '$routeParams', '$location', '$timeout', 'Upload', 'Authentication', 'Issues', 'Entries', 'Authors', '$log', '$q',
    function($scope, $mdDialog, $routeParams, $location, $timeout, Upload, Authentication, Issues, Entries, Authors, $log, $q) {
      $scope.authentication = Authentication;
      $scope.year = (new Date()).getFullYear();
      $scope.issueNumber = 5 // TODO: Defaults to last issue
      $scope.authorInfo = [];
      $scope.seasons = {
        'Summer': 'verão',
        'Fall': 'outono',
        'Winter': 'inverno',
        'Spring': 'primavera'
      }

      //$scope.articles = [{id: 'article1', titleEn: 'Entry 1', keywordsEn: [], keywordsPt: []}];

      $scope.articles = [{id: 'article1', titles: [],
        namings: [{
          title: "Main title",
          keywords: [],
          desc: ""}],
        authorAutos: [{searchText: ""}]
      }];

      // $scope.images= [];
      // $scope.authorAutos = [{searchText: ""}];
      // $scope.namings = [{title: "Main title", keywords: [], desc: ""}];

      // Namings adding removal -------------------------------
      $scope.addNewNaming = function(entry) {
        entry.namings.push({title: "Secondary title",
                             keywords: [], desc: ""});
      }

      $scope.removeNaming = function(entry, item) {
        entry.namings.splice(item, 1);
      }
      // Authors adding removal -------------------------------
      $scope.addNewAuthor= function(entry) {
        entry.authorAutos.push({searchText: ""});
      }

      $scope.removeAuthor= function(entry, item) {
        entry.authorAutos.splice(item, 1);
      }
      // -------------------------------------------------------
      
      
      // ----------------- Create new Author dialog ------------
      $scope.dialogCreate = function($event) {
        $mdDialog.show({
          controller: function ($timeout, $q, $scope, $mdDialog) {
              var quest =this; 
              // you will be returning quest

              $scope.cancel = function($event) {
              $mdDialog.cancel();
              };
              $scope.finish = function($event) {
              $mdDialog.hide();
              };
              $scope.answer = function() {
              //pass quest to hide function.
              $mdDialog.hide(quest);
              };
              },
          controllerAs: 'createAuthor',
          templateUrl: 'createAuthor.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose:true,
          locals: {parent: $scope},
          
        })
        .then(function(params) {
            var author = new Authors({
              name: params.name,
              last: params.last,
              bio: params.bio
            });

            author.$save(function(response) {
              // Reload authors for autocompleter
              self.authors = loadAllAuthors();
            }, function(errorResponse) {
              console.log(errorResponse.data.message);
              $scope.error = errorResponse.data.message;
            });

            //createAuthor.name= '';
            //createAuthor.last= '';
            //createAuthor.bio= '';
          });
      };
      // -------------------------------------------------------


      $scope.addNewArticle = function() {
        var newArticleNo = $scope.articles.length+1;

        $scope.articles.push({
          id: 'article'+newArticleNo,
          titles: [],
          namings: [{
            title: "Main title",
            keywords: [],
            desc: ""}],
          authorAutos: [{searchText: ""}]
        });
      }

      $scope.removeArticle = function(item) {
        $scope.articles.splice(item, 1);
      };

      $scope.addIssuePdf = function(files, errFiles) {
        $scope.pdf = files[0];
        $scope.errFiles= errFiles;
      }
      $scope.addEntryPdf = function(entry, files, errFiles) {
        entry.pdf = files[0];
        entry.errFiles= errFiles;
      }

      $scope.uploadPdf = function(model, pdf) {
        if (typeof pdf != 'object') return;
        // issuePdf = $scope.pdf;
        // console.log(pdf);
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
      
      $scope.addImages = function(entry, imageFiles, errFiles) {
        entry.imageFiles = imageFiles;
        entry.errFiles = errFiles;
      }

      $scope.uploadImages = function(entry, imageFiles/*files, errFiles*/) {
        if (!imageFiles) return;
        if (imageFiles.length==0) return;
        
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
      }


      $scope.toggleAbstract = function(index) {
        var abs = $(".abstract").eq(index);
        if (abs.css("display") == "none") {
          abs.css("display", "inherit");
        } else {
          abs.css("display", "none");
        }
      }
      
      var currSavedEntries = [];
      var entriesProcessed = 0;
      var allgood = true;
      function checkEntriesDone(issue, numEntries) {
        entriesProcessed++;
        if (numEntries == entriesProcessed) {
          // All good!
          if (allgood) {
            $location.path('issues/' + issue._id);
          } else { // Delete all
            angular.forEach(currSavedEntries, function (entry) {
              entry.$remove();
            });
            issue.$remove();
          }
        }
      }

      $scope.create = function() {
        entriesProcessed = 0;
        currSavedEntries = [];
        allgood = true;

        // TODO: See whats up with img, pdf storage
        var newIssue = new Issues({
          issueNumber: this.issueNumber,
          notesEn: this.notesEn,
          season: this.season,
          year: this.year
        });


        // Attempt to save issue.
        newIssue.$save(function(issueResponse) {
          $scope.uploadPdf(newIssue, $scope.pdf);
          // If issue save succeeded, try to save each entry.
          // newEntries = []
          angular.forEach($scope.articles, function (entryData) {
            var entry = new Entries({
              authors: [],
              titles: [],
              keywordSets: [],
              descs: [],

              type: entryData.type,
              issue: newIssue._id,
            });

            // authors array is inserted in alphabetical order.
            entryData.authorAutos.sort(function(authorData) {
              splittedName = authorData.searchText.split(' ');
              return splittedName[1] + splittedName[0];
            })
            angular.forEach(entryData.authorAutos, function(authorData) {
              entry.authors.push(authorData.selectedItem._id);
            });

            angular.forEach(entryData.namings, function(namingData) {
              entry.titles.push(namingData.title);
              entry.keywordSets.push(namingData.keywords);
              entry.descs.push(namingData.desc);
            });

            entry.$save(function(response) {
              $scope.uploadPdf(entry, entryData.pdf);
              $scope.uploadImages(entry, entryData.imageFiles);

              currSavedEntries.push(response);
              checkEntriesDone(issueResponse, $scope.articles.length);

            }, function(errorResponse) {
              // TODO: how to make the error show up there?
              console.log(errorResponse.data.message);
              $scope.error = (entryData.titleEn ? entryData.titleEn : '') + ': ' + errorResponse.data.message;
              // $location.path('issues/' + response._id + '/edit');
              allgood = false;
              checkEntriesDone(issueResponse, $scope.articles.length);
            })
          });

        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });

      };

      $scope.update = function(entries) {
        //console.log($scope.entries);
        $scope.issue.$update(function() {
          $scope.uploadPdf($scope.issue, $scope.pdf);

          angular.forEach($scope.entries, function(entry) {

            // HACK, PLZ MAKE IT PRETTY
            var newPdf = entry.pdf;
            if (typeof entry.pdf == 'object') {
              delete entry.pdf
            }
            console.log(entry);

            entry.authors = [];
            entry.titles = [];
            entry.keywordSets = [];
            entry.descs = [];

            angular.forEach(entry.authorAutos, function(authorData) {
              entry.authors.push(authorData.selectedItem._id);
            });
            angular.forEach(entry.namings, function(namingData) {
              entry.titles.push(namingData.title);
              entry.keywordSets.push(namingData.keywords);
              entry.descs.push(namingData.desc);
            });
            

            entry.$update(function() {
              $scope.uploadPdf(entry, newPdf);
              //$scope.uploadImages(entry, entryData.imageFiles);


            }, function(errorResponse) {
              $scope.error = errorResponse.data.message;
              console.log($scope.error);
            });

          });
          
          $timeout(function(){
            $location.path('issues/' + $scope.issue._id);
          }, 2000);

        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
          console.log($scope.error);
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
        }, function(res){
          for (var i=0; i<res.length; i++) {
            currIndex = i
            currEntry = res[i];
            $scope.authorInfo.push([]);
            for (var j=0; j<currEntry.authors.length; j++) {
              Authors.query({
                _id: currEntry.authors[j]
              }, function(r) {
                $scope.authorInfo[currIndex].push(r[0]);
              });
            }
          }
        });
      };

      // Only differece is the loadings of the autocompletes and authors, that,
      // while not that rigorous, makes no sense on executing on each view.
      $scope.findOneEdit = function() {
        $scope.issue = Issues.get({
          issueId: $routeParams.issueId
        }, function() {
        });
        self.authors = loadAllAuthors();
        $scope.entries = Entries.query({
          issue: $routeParams.issueId
        }, function(res){
          for (var i=0; i<res.length; i++) {
            currIndex = i
            currEntry = res[i];
            currEntry.authorAutos = [];
            currEntry.namings = [];
            $scope.authorInfo.push([]);

            for (var j=0; j<currEntry.authors.length; j++) {
              Authors.query({
                _id: currEntry.authors[j]
              }, function(r) {
                $scope.authorInfo[currIndex].push(r[0]);
                currEntry.authorAutos.push({
                  searchText: r[0].name + " " + r[0].last,
                  selectedItem: r[0]
                });
              });
            }
            for (var jj=0; jj<currEntry.titles.length; jj++) {
              currEntry.namings.push({
                title: currEntry.titles[jj],
                keywords: currEntry.keywordSets[jj],
                desc: currEntry.descs[jj]
              });
            }
          }
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

      $scope.checkEntry = function(type) {
        return function(entry) {
          return entry.type == type;
        }
      };

      // ------- Autocomplete --------------------------------------
      var self = this;
      self.simulateQuery = false;
      self.isDisabled    = false;
      self.authors = loadAllAuthors();
      self.querySearch   = querySearch;
      self.selectedItemChange = selectedItemChange;
      self.searchTextChange   = searchTextChange;

      function querySearch (query) {
        var results = query ? self.authors.filter(createFilterFor(query)) : self.authors;
          return results;
      }

      function searchTextChange(text) {
        $log.info('Text changed to ' + text);
      }
      function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
      }

      /**
      * Build `authors` list of key/value pairs
      */
      function loadAllAuthors() {
        var allAuthors = Authors.query(function() {
          // console.log(allAuthors)
          allAuthors = allAuthors.map( function (author) {
            author.value = author.name.toLowerCase();
            return author;
          });
        });

        return allAuthors;
      }

      /**
      * Create filter function for a query string
      */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }
      // -------------------------------------------------------
    }
  ]
);
