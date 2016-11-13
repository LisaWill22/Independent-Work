'use strict';

angular.module('settings')
    .controller('PostsSettingsCtrl', function($scope) {
        console.log('PostsSettingsCtrl loaded >>', $scope);
        $scope.data = angular.copy($scope.currentUser);
    });
