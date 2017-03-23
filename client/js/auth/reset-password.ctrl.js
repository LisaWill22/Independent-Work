'use strict';

angular.module('auth')
    .controller('ResetPasswordCtrl', function($scope, $http, $state, $stateParams,$timeout, toastr) {
        console.log('ResetPasswordCtrl loaded >>', $scope);

        $scope.data = {};

        console.log($stateParams);

        if (!$stateParams.resetToken) {
            return $state.go('app.auth.reset-password');
        } else {
            $scope.data.resetToken = $stateParams.resetToken;
            $scope.data.email = $stateParams.email;
        }

        $scope.onError = function(err) {
            console.log(err);
            toastr.warning('Ooops, there was an error with your request');
        };

        $scope.beforeSubmit = function() {

        };

        $scope.afterSubmit = function(res) {
            console.log(res);
            $scope.data = {};
            toastr.success('Your password was updated successfully!');
            $timeout(function() {
                $state.go('app.auth.login');
            }, 1250);

        };
    });
