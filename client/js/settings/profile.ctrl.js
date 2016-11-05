'use strict';

angular.module('settings')
    .controller('ProfileCtrl', function($scope) {

        console.log('ProfileCtrl loaded >>', $scope);

        $scope.data = angular.copy($scope.currentUser);

    });
