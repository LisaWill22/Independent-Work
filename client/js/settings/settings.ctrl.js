'use strict';

angular.module('settings')
    .controller('SettingsCtrl', function($scope, $rootScope) {
        console.log('SettingsCtrl loaded >>', $scope);
        $rootScope.hideFooter = true;
    });
