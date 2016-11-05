'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function($scope) {
        console.log('DashboardCtrl loaded >>', $scope);

        console.log($scope.currentUser);
    });
