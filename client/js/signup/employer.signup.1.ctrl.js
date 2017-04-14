'use strict';

angular.module('signup')
    .controller('EmployerSignupOneCtrl', function($scope, $http, $state, $timeout, toastr) {
        console.log('EmployerSignupOneCtrl loaded >>', $scope);
        console.log("EmployerSignupOneCtrl Controller", $scope.currentUser);

        $scope.data = {};
        $scope.data.roles = [];
        $scope.data.roles.push('employer');

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
                        $state.go('app.signup.employer.two');
                    })
                    .catch(function(err) {
                        console.log(err);
                    })
                    .finally(function() {

                    });

            }, 500);
        };
    });
