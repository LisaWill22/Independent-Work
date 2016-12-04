'use strict';

angular.module('chat')
    .controller('ChatConversationCtrl', function($scope, $http, $stateParams, toastr, socket) {
        console.log('ConversationCtrl ctrl loaded >>', $scope);

        // socket.emit('subscribe', conversation_id);
        //
        // socket.emit('send message', {
        //     room: conversation_id,
        //     message: "Some message"
        // });
        //
        // socket.on('conversation private post', function(data) {
        //     //display data.message
        // });

        // Get the user to display some info about them
        $http.get('/api/users/' + $stateParams.friendId)
            .then(function(res) {
                console.log(res);
                $scope.otherUser = res.data;
            })
            .catch(function(error) {
                console.error(error);
                toastr.warning('Oops something went wrong...');
            });

        // Should actually get a chatThread between these two users
        $http.get('/api/users/' + $scope.currentUser._id + '/chat/' + $stateParams.friendId)
            .then(function(res) {
                console.log(res);
                $scope.chatThread = res.data.chatThread;
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
            if (!$scope.chatThread || !$scope.chatThread._id) {
                // Runs the first time a chat is started
                // Creates a thread to attach chats and users to
                $scope.data.users = [ $scope.currentUser._id, $scope.otherUser._id ];
                $scope.data.chats = [];
                $scope.data.chat = {
                    users: [ $scope.currentUser._id, $scope.otherUser._id ],
                    message: $scope.data.message,
                    unread: true,
                    sender: $scope.currentUser._id,
                    _dateSent: new Date()
                };
            } else if ($scope.chatThread && $scope.chatThread._id) {
                // Runs every subsequent submit
                // Now the form is PUT request that simply creates a new Chat and
                // adds that chat to the current thread
                console.log('chatThread is existing');
                $scope.data.chatThread = angular.copy($scope.chatThread);
                $scope.data.chat = {
                    users: [ $scope.currentUser._id, $scope.otherUser._id ],
                    message: $scope.data.message,
                    unread: true,
                    sender: $scope.currentUser._id,
                    _dateSent: new Date()
                };
            }

        };

        $scope.afterSubmit = function(res) {
            console.log(res);
            // either update the chatThread or add the new chat
            if (res.data.chat) {
                $scope.chatThread.chats.push(res.data.chat);
            } else if (res.data.chatThread) {
                $scope.chatThread = res.data.chatThread;
            }

            // reset input
            $scope.data = {};

            // Scroll to the bottom of the chat container div
            $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 500);
        };
    });
