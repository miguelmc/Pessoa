angular.module('entries').controller('EntriesController',
  ['$scope', '$routeParams', '$location', '$mdDialog', '$timeout', 'Upload', 'Authentication', 'Entries',
    function($scope, $routeParams, $location, $mdDialog, $timeout, Upload, Authentication, Entries) {
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

      $scope.find = function() {
        // Hack, but it works!
        $scope.title = $location.search().type + 's';

        $scope.entries = Entries.query($location.search());
      };

      $scope.findOne = function() {
        $scope.entry = Entries.get({
          entryId: $routeParams.entryId
        });
        $scope.entry.keywordsPt = [];
        $scope.entry.keywordsEn = [];
        console.log($scope.entry);
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

