'use strict';

angular.module('chat')
    .controller('ChatCtrl', function($scope, $http, toastr, socket) {
        console.log('Chat ctrl loaded >>', $scope);
        $http.get('/api/users')
            .then(function(res) {
                $scope.users = res.data.filter(function(user) {
                    return user._id !== $scope.currentUser._id;
                });
            });
    });
