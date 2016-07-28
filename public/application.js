var mainApplicationModuleName = "pessoa";

var mainApplicationModule = angular.module(mainApplicationModuleName,
                       ['ngResource', 'ngMaterial', 'ngRoute', 'ngFileUpload', 'users', 'index', 'entries', 'issues', 'authors']);

// This makes it indexable by search engine crawlers.
mainApplicationModule.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});
