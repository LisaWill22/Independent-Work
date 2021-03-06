'use strict';

angular.module('signup')
    .controller('SignupCtrl', function($scope, $http, $rootScope, toastr) {

        console.log('SignupController loaded >>', $scope);

        $rootScope.hideFooter = true;

        $scope.signup = function () {
            $http.post('/auth/signup', $scope.data)
                .then(function(response) {
                    console.log($scope.data);
                    console.log(response);
                    toastr.success('You have successfully created an account!');
                    $state.go('app.auth.login');
                }, function(err) {
                    console.log(err);
                    toastr.error('There was an error creating your account. Please try again.');
                });
        };
    });
