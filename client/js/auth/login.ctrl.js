'use strict';

angular.module('auth')
    .controller('LoginCtrl', function($scope, $http, $state, $rootScope, toastr) {
        console.log('LoginCtrl loaded >>', $scope);

        $scope.data = {};

        $scope.afterSubmit = function(res) {
            toastr.success('Successfully logged in');
            $state.go('app.dashboard');
            $rootScope.$broadcast('Session:refresh', res.data);
            $scope.$storage.userId = res.data._id;

        };

        $scope.onError = function(err) {
            toastr.warning('Whoops, something went wrong...');
            console.log(err);
        };

    });
