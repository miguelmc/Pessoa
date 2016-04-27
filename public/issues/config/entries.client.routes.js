angular.module('entries').config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/entries', {
      templateUrl: 'entries/views/list-entries.client.view.html'
    }).
    when('/entries/create', {
      templateUrl: 'entries/views/create-entry.client.view.html'
    }).
    when('/entries/:entryId', {
      templateUrl: 'entries/views/view-entry.client.view.html'
    }).
    when('/entries/:entryId/edit', {
      templateUrl: 'entries/views/edit-entry.client.view.html'
    });
  }
]);
