'use strict';

angular.module('signup')
    .controller('EmployerSignupCtrl', function($scope) {
        console.log('EmployerSignupCtrl loaded >>', $scope);
        
        $scope.data = {};
        $scope.data.employer = true;
    });
