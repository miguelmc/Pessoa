angular.module('authors').factory('Authors', ['$resource',
  function($resource) {
    return $resource('api/authors/:authorId', {
      authorId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
