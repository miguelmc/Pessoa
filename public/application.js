var mainApplicationModuleName = "pessoa";

var mainApplicationModule = angular.module(mainApplicationModuleName,
                       ['ngResource', 'ngMaterial','material.svgAssetsCache', 'ngRoute', 'ngFileUpload', 'users', 'index', 'entries', 'issues', 'authors']);

// This makes it indexable by search engine crawlers.
mainApplicationModule.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);

angular.element(document).ready(function() {
  angular.bootstrap(document, [mainApplicationModuleName]);
});
