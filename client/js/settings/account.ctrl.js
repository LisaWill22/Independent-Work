'use strict';

angular.module('settings')
    .controller('AccountSettingsCtrl', function($scope) {
        console.log('AccountSettingsCtrl loaded >>', $scope);
        $scope.data = angular.copy($scope.currentUser);
    });
