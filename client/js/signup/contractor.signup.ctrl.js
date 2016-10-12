'use strict';

angular.module('signup')
    .controller('ContractorSignupCtrl', function($scope, $http, $state, toastr) {
        console.log('ContractorSignupCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.data.contracter = true;
    });
