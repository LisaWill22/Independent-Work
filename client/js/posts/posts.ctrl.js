'use strict';

angular.module('posts')
    .controller('PostsCtrl', function($scope) {

        console.log('PostsCtrl loaded >>', $scope);

        $scope.data = angular.copy($scope.currentUser);

    });
