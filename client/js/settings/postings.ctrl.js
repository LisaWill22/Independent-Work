'use strict';

angular.module('settings')
    .controller('PostingSettingsCtrl', function($scope) {
        console.log('PostingsSettingsCtrl loaded >>', $scope);
        $scope.data = angular.copy($scope.currentUser);
    });
