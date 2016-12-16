angular.module('entries').controller('EntriesController',
  ['$scope', '$routeParams', '$location', '$mdDialog', '$timeout', 'Upload', 'Authentication', 'Entries', 'Authors', '$log', '$q',
    function($scope, $routeParams, $location, $mdDialog, $timeout, Upload, Authentication, Entries, Authors, $log, $q) {

      $scope.authentication = Authentication;
      $scope.keywordsEn = [];
      $scope.keywordsPt = [];
      $scope.authorInfo = {};
      $scope.entriesSorted = {};
      $scope.issue = 1; // TODO: default to last issue created

      $scope.authorAutos = [{searchText: ""}];
      $scope.namings = [{title: "Main title", keywords: [], desc: ""}];


      // Namings adding removal -------------------------------
      $scope.addNewNaming = function() {
        $scope.namings.push({title: "Secondary title",
                             keywords: [], desc: ""});
      }

      $scope.removeNaming = function(item) {
        $scope.namings.splice(item, 1);
      }
      // Authors adding removal -------------------------------
      $scope.addNewAuthor= function() {
        $scope.authorAutos.push({searchText: ""});
      }

      $scope.removeAuthor= function(item) {
        $scope.authorAutos.splice(item, 1);
      }
      // -------------------------------------------------------
      

      $scope.toggleAbstract = function(index) {
        var abs = $(".abstract").eq(index);
        if (abs.css("display") == "none") {
          abs.css("display", "inherit");
        } else {
          abs.css("display", "none");
        }
      }

      $scope.openDialog = function($event, image) {
        $mdDialog.show({
          controller: ImageDialogCtrl,
          template: 
            '<md-dialog aria-label="Autocomplete Dialog Example" ng-cloak>' +
              '<md-toolbar>' +
                '<div class="md-toolbar-tools">' +
                  '<h2>Image</h2>' +
                  '<span flex></span>' +
                  '<md-button class="md-icon-button" ng-click="cancel()">' +
                    '<md-icon md-svg-src="img/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
                  '</md-button>' +
                '</div>' +
              '</md-toolbar>' +
              '<md-dialog-content>' +
                '<div class="md-dialog-content" style="text-align: center;">' +
                  '<img src=/file/'+image+' height="600">' +
                '</div>' +
              '</md-dialog-content>' +
              '<md-dialog-actions>' +
                '<md-button style="color: maroon" class="md-primary" href="/file/'+image+'">download image</md-button>' +
                '<md-button class="md-primary" aria-label="Finished" ng-click="finish($event)">Close</md-button>' +
              '</md-dialog-actions>' +
            '</md-dialog>',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose: true,
          locals: {img: image}
        });

        function ImageDialogCtrl($scope, $mdDialog, img) {
          $scope.cancel = function($event) {
            $mdDialog.cancel();
          };
          $scope.finish = function($event) {
            $mdDialog.hide();
          };
        }
      }

      $scope.addEntryPdf = function(files, errFiles) {
        $scope.pdf = files[0];
        $scope.errFiles= errFiles;
      }

      $scope.addImages = function(imageFiles, errFiles) {
        $scope.imageFiles = imageFiles;
        $scope.imgErrFiles = errFiles;
        console.log($scope.imageFiles);
      }

      $scope.uploadImages = function(entry) {
        imageFiles = $scope.imageFiles;
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

      $scope.uploadPdf = function(entry) {
        pdf = $scope.pdf;
        if (typeof pdf != 'object') return;

        pdf.upload = Upload.upload({
            url: 'file',
            data: {file: pdf}
        });

        pdf.upload.then(function (response) {
            $timeout(function () {
                pdf.result = response.data;
                entry.pdf = pdf.result;
                entry.$update();
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            pdf.progress = Math.min(100, parseInt(100.0 * 
                                    evt.loaded / evt.total));
        });
      }

      $scope.create = function() {
        // TODO: See whats up with img, pdf storage
        var entry = new Entries({
          //author: this.author,
          authors: [],
          titles: [],
          keywordSets: [],
          descs: [],
          type: this.type,
          issue: this.issue,
        });

        // authors array is inserted in alphabetical order.
        $scope.authorAutos.sort(function(authorData) {
          splittedName = authorData.searchText.split(' ');
          return splittedName[1] + splittedName[0];
        })
        angular.forEach($scope.authorAutos, function(authorData) {
          entry.authors.push(authorData._id);
        });

        angular.forEach($scope.namings, function(namingData) {
          entry.titles.push(namingData.title);
          entry.keywordSets.push(namingData.keywords);
          entry.descs.push(namingData.desc);
        });

        entry.$save(function(response) {
          $scope.uploadPdf(entry);
          $scope.uploadImages(entry);
          $location.path('entries/' + response._id);
        }, function(errorResponse) {
          console.log(errorResponse.data.message);
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.update = function() {
        $scope.entry.$update(function() {
          $scope.uploadPdf($scope.entry);
          $scope.uploadImages($scope.entry);
          $location.path('entries/' + $scope.entry._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      /*
       * Sorts entries alphabetically,
       * joins entries that have the same author
       */
      function mergeCommonEntries() {

        angular.forEach($scope.entries, function(entry) {
          key = entry.authors
                     .map(function(id) {
                            author = $scope.authorInfo[id];
                            return author.last + author.name;
                          })
                     .sort()
                     .join('');

          if (key in $scope.entriesSorted) {
            $scope.entriesSorted[key].push(entry);
          }
          else {
            $scope.entriesSorted[key] = [entry];
          }
        });

        $scope.entriesSorted = Object.keys($scope.entriesSorted).map(function(key) {
              return $scope.entriesSorted[key];
        });
        $scope.entriesSorted = $scope.entriesSorted.sort().reverse();

        $scope.$apply();
        console.log($scope.entriesSorted);
      }

      $scope.find = function() {
        // Hack, but it works!
        $scope.title = $location.search().type + 's';

        $scope.authorInfo = {};
        $scope.entries = Entries.query($location.search(), function (res) {
          // Get all needed authors.
          angular.forEach(res, function(currEntry) {
            angular.forEach(currEntry.authors, function(authorId) {
              $scope.authorInfo[authorId] = {};
            });
          });

          // Deep copy
          var authorInfoCopy = jQuery.extend(true, {}, $scope.authorInfo);
          var count = [0];

          angular.forEach(authorInfoCopy, function(author, id) {
            var cnt = this;
            Authors.query({
              _id: id 
            }, function(r) {
              $scope.authorInfo[id] = r[0];
              cnt[0]++;
            });
          }, count);

          var _flagCheck = setInterval(function() {
            if (count[0] == Object.keys($scope.authorInfo).length) {
              clearInterval(_flagCheck);
              mergeCommonEntries();
            }
          }, 100); // interval set at 100 milliseconds
        });
      };

      $scope.findOne = function() {
        $scope.entry = Entries.get({
          entryId: $routeParams.entryId
        });
        $scope.entry.keywordsPt = [];
        $scope.entry.keywordsEn = [];
        console.log($scope.entry);
      };

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

      // ------- Autocomplete --------------------------------------
      var self = this;
      self.simulateQuery = false;
      self.isDisabled    = false;
      self.authors = loadAllAuthors();
      self.querySearch   = querySearch;
      self.selectedItemChange = selectedItemChange;
      self.searchTextChange   = searchTextChange;

      function querySearch (query) {
        var results = query ? self.authors.filter( createFilterFor(query) ) : self.authors,
            deferred;
        if (self.simulateQuery) {
          deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        } else {
          return results;
        }
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
          allAuthors = allAuthors.map( function (author) {
            author.value = author.name.toLowerCase();
            //author.name = author.name;
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

