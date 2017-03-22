'use strict';

angular.module('auth')
    .controller('ForgotPasswordCtrl', function($scope, $http, toastr) {
        console.log('ForgotPasswordCtrl loaded >>', $scope);

        $scope.data = {};

        $scope.onError = function(err) {
            console.log("Forgot Password Error", err);
            toastr.warning('Ooops, there was an error with your request');
            $scope.emailNotFound = err.data.email;
        };

        $scope.beforeSubmit = function() {
            $scope.emailNotFound = null;
        };

        $scope.afterSubmit = function(res) {
            console.log(res);
            $scope.emailNotFound = null;
            $scope.data = {};
        };
    });
