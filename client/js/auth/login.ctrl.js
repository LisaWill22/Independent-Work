'use strict';

angular.module('auth')
    .controller('LoginCtrl', function($scope, $http, $state, toastr) {
        console.log('LoginCtrl loaded >>', $scope);

        $scope.data = {};

        $scope.login = function() {
            $http.post('/auth/login', $scope.data)
                .then(function(res) {
                    toastr.success('Successfully logged in');
                    $state.go('app.dashboard');
                    $rootScope.$broadcast('Session:refresh', res.data);
                    $scope.$storage.userId = res.data._id;
                }, function(err) {
                    toastr.warning('Whoops, something went wrong...');
                    console.log(err);
                });
        };
    });
