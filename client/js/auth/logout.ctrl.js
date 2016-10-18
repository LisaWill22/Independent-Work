'use strict';

angular.module('auth')
    .controller('LogoutCtrl', function($scope, $state, $http, $timeout, $rootScope, toastr) {
        console.log('LogoutCtrl loaded >>', $scope);

        $http.get('/auth/logout')
            .then(function(res){
                $timeout(function() {
                    $rootScope.$emit('Session:refresh', null);
                    toastr.success('You have successfully logged out');
                    $state.go('app.home');
                }, 500)
            }, function(err) {
                console.log(err);
            })
    });
