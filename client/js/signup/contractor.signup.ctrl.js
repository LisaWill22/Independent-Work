'use strict';

angular.module('signup')
    .controller('ContractorSignupCtrl', function($scope, $http, $state, $timeout, toastr) {
        console.log('ContractorSignupCtrl loaded >>', $scope);

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
            toastr.success('You have successfully created an account!');
            $timeout(function(){
                $state.go('app.auth.login');
            }, 500);
        };
    });
