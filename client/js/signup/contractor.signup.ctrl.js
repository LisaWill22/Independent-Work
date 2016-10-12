'use strict';

angular.module('signup')
    .controller('ContractorSignupCtrl', function($scope, $http, $state, $timeout, toastr) {
        console.log('ContractorSignupCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.data.roles = [];
        $scope.data.roles.push('contractor');

        $scope.signup = function () {
            $http.post('/auth/signup', $scope.data)
                .then(function(response) {
                    toastr.success('You have successfully created an account!');
                    $timeout(function(){
                        $state.go('app.auth.login');
                    }, 500);
                }, function(err) {
                    console.error(err);
                    toastr.error('There was an error creating your account. Please try again.');
                });
        };
    });
