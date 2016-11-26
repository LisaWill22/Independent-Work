'use strict';

angular.module('auth')
    .controller('AuthCtrl', function($scope, $rootScope) {
        console.log('authCtrl loaded >>', $scope);
        $rootScope.hideFooter = true;
    });
