'use strict';

angular.module('auth')
    .controller('LoginCtrl', function($scope, $http, $state, $rootScope, toastr) {
        console.log('LoginCtrl loaded >>', $scope);

        $scope.data = {};

        $scope.afterSubmit = function(res) {
            toastr.success('Successfully logged in');
            if (res.data && res.data.image && res.data.bio.length && (res.data.skills.length || res.data.roles.indexOf('employer') != -1)) {
                $state.go('app.dashboard');
            } else {
                $state.go('app.settings.profile');
            }
            $rootScope.$broadcast('Session:refresh', res.data);
            $scope.$storage.userId = res.data._id;
        };

        $scope.onError = function(err) {
            toastr.warning('Whoops, something went wrong...');
            console.log(err);
        };

    });
