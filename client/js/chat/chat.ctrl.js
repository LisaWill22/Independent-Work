'use strict';

angular.module('chat')
    .controller('ChatCtrl', function($scope, $http, toastr, socket) {
        console.log('Chat ctrl loaded >>', $scope);
    });
