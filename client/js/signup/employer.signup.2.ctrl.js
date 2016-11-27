'use strict';

angular.module('signup')
    .controller('EmployerSignupTwoCtrl', function($scope, $state, $timeout, toastr, states) {
        console.log('EmployerSignupTwoCtrl loaded >>', $scope);

        $scope.states = states;

        if (!$scope.currentUser) {
            return $state.go('app.signup.employer.one');
        }

        $scope.onError = function(err) {
            console.error(err);
            toastr.error('There was an error creating updating your account. Please try again.');
        };

        $scope.afterSubmit = function(res) {
            $scope.$emit('Session:refresh', res.data.user);
            $timeout(function() {
                toastr.success('You have successfully updated your profile!');
                $state.go('app.dashboard');
            }, 300);
        };
    });
