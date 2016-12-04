'use strict';

angular.module('chat')
    .controller('ChatConversationCtrl', function($scope, $http, $stateParams, toastr, socket) {
        console.log('ConversationCtrl ctrl loaded >>', $scope);

        $http.get('/api/users/' + $stateParams.friendId)
            .then(function(res) {
                console.log(res);
                $scope.otherUser = res.data;
            })
            .catch(function(error) {
                console.error(error);
                toastr.warning('Oops something went wrong...');
            });

        $http.get('/api/users/' + $scope.currentUser._id + '/chat/' + $stateParams.friendId)
            .then(function(res) {
                console.log(res);
                $scope.chats = res.data.chat;
                $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 500);
            })
            .catch(function(error) {
                console.error(error);
                toastr.warning('Ooops something went wrong...');
            });


        $scope.onError = function(err) {
            console.log(err);
            toastr.warning('Oops we couldn\'t send your message...');
        };

        $scope.beforeSubmit = function() {
            $scope.data.users = [ $scope.currentUser._id, $scope.otherUser._id ]
            $scope.data.unread = true,
            $scope.data._dateSent = new Date();
            $scope.sender = $scope.currentUser._id;
        };

        $scope.afterSubmit = function(res) {
            console.log(res);
            $scope.data = {};
            $scope.chats.push(res.data.chat);
            $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 500);
        };
    });
