'use strict';

angular.module('signup')
    .controller('ContractorSignupCtrl', function($scope, $http, $state, toastr) {
        console.log('ContractorSignupCtrl loaded >>', $scope);

        $scope.data = {};

        $scope.signup = function () {
            console.log('clicked');
            $http.post('/auth/signup', $scope.data)
                .then(function(response) {
                    console.log(response);
                    toastr.success('You have successfully created an account!');
                    $state.go('app.auth.login');
                }, function(err) {
                    console.log(err);
                    toastr.error('There was an error creating your account. Please try again.');
                });
        };
    });
