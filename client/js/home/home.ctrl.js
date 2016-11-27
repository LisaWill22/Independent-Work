'use strict';

angular.module('home')
    .controller('HomeCtrl', function($scope, $rootScope, toastr) {
        $rootScope.hideFooter = false;
    });
