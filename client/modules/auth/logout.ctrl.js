'use strict';

angular.module('auth')
    .controller('LogoutCtrl', function($scope) {
        console.log('LogoutCtrl loaded >>', $scope);

        $scope.logout = function() {

        };
    });
