angular.module('authors').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/authors', {
      templateUrl: 'authors/views/list-authors.client.view.html'
    }).
    when('/authors/create', {
      templateUrl: 'authors/views/create-author.client.view.html'
    }).
    when('/authors/:authorId', {
      templateUrl: 'authors/views/view-author.client.view.html'
    }).
    when('/authors/:authorId/edit', {
      templateUrl: 'authors/views/edit-author.client.view.html'
    });
  }
]);
