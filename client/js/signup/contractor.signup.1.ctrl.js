'use strict';

angular.module('signup')
    .controller('ContractorSignupOneCtrl', function($scope, $http, $state, $timeout, toastr) {
        console.log('ContractorSignupOneCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.data.roles = [];
        $scope.data.roles.push('contractor');

        $scope.onError = function(err) {
            console.error(err);
            $scope.data.password = null;
            $scope.data.passwordConfirm = null;
            toastr.error('There was an error creating your account. Please try again.');
        };

        $scope.beforeSubmit = function() {
            delete $scope.data.passwordConfirm;
        };

        $scope.afterSubmit = function(res) {
            // toastr.success('You have successfully created an account!');
            $timeout(function(){

                var data = {
                    email: $scope.data.email,
                    password: $scope.data.password
                };

                $http.post('/auth/login', data)
                    .then(function(res) {
                        console.log(res);
                        $scope.$emit('Session:refresh', res.data);
                        $state.go('app.signup.contractor.two');
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                    .finally(function() {

                    });

            }, 500);
        };
    });
