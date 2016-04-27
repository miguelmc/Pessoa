angular.module('issues').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/issues', {
      templateUrl: 'issues/views/list-issues.client.view.html'
    }).
    when('/issues/create', {
      templateUrl: 'issues/views/create-issue.client.view.html'
    }).
    when('/issues/:issueId', {
      templateUrl: 'issues/views/view-issue.client.view.html'
    }).
    when('/issues/:issueId/edit', {
      templateUrl: 'issues/views/edit-issue.client.view.html'
    });
  }
]);
