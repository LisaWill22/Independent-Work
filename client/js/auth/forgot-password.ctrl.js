'use strict';

angular.module('auth')
    .controller('ForgotPasswordCtrl', function($scope, $http) {
        console.log('ForgotPasswordCtrl loaded >>', $scope);

        $scope.resetPassword = function() {
            $http.post('/auth/forgot', $scope.data)
                .then(function(res) {
                    console.log(res);
                }, function(err) {
                    console.log(err);
                });
        }
    });
