'use strict';

angular.module('signup')
    .controller('EmployerSignupCtrl', function($scope, $http, $state, $timeout, toastr) {
        console.log('EmployerSignupCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.data.roles = [];
        $scope.data.roles.push('employer');

        $scope.signup = function () {
            $http.post('/auth/signup', $scope.data)
                .then(function(response) {
                    toastr.success('You have successfully created an account!');
                    $timeout(function(){
                        $state.go('app.auth.login');
                    }, 500);
                }, function(err) {
                    console.warn(err);
                    toastr.error('There was an error creating your account. Please try again.');
                });
        };
    });
