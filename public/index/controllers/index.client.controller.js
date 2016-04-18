angular.module('index').controller('IndexController', ['$scope',
                                                       'Authentication',
  function($scope, Authentication) {
    $scope.authentication = Authentication;

    $scope.myInterval = 3000;
    $scope.slides= [
      {image: '/img/pessoa1.jpg', title: "Content title 1"},
      {image: '/img/pessoa2.jpg', title: "Content title 2"},
      {image: '/img/pessoa3.jpg', title: "Content title 3"},
      {image: '/img/pessoa4.jpg', title: "Content title 4"},
      {image: '/img/pessoa5.jpg', title: "Content title 5"}
    ];
  }
]);
