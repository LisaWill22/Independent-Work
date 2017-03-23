'use strict';

angular.module('settings')
    .controller('MsgSettingsCtrl', function($scope) {
        console.log('MsgSettingsCtrl loaded >>', $scope);
        $scope.data = angular.copy($scope.currentUser);
        
    });
