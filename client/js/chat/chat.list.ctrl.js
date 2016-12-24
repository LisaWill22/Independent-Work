'use strict';

angular.module('chat')
    .controller('ChatListCtrl', function($scope, $http, $timeout, socket, toastr) {
        console.log('ChatListCtrl loaded >>', $scope);

        $scope.loading = true;

        getChats()
            .then(function(res) {
                $scope.chatThreads = res.data.chatThreads.map(function(thread) {
                    var otherUser = thread.users.find(function(user) {
                        return user._id !== $scope.currentUser._id;
                    });
                    thread.otherUser = otherUser;
                    return thread;
                });
                $scope.loading = false;
            });

        function getChats() {
            return $http.get('/api/users/' + $scope.currentUser._id + '/chats');
        }

    });
