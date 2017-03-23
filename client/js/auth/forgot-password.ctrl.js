'use strict';

angular.module('auth')
    .controller('ForgotPasswordCtrl', function($scope, $http, toastr) {
        console.log('ForgotPasswordCtrl loaded >>', $scope);

        $scope.data = {};

        $scope.onError = function(err) {
            toastr.warning('Ooops, there was an error with your request');
            $scope.emailNotFound = err.data.email;
        };

        $scope.beforeSubmit = function() {
            $scope.emailNotFound = null;
        };

        $scope.afterSubmit = function(res) {
            console.log(res, "sending ya a new password");
            $scope.emailNotFound = null;
            $scope.data = {};
        };
    });
