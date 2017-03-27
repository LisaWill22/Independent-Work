'use strict';

angular.module('chat')
    .controller('ChatConversationCtrl', function($scope, $http, $stateParams, $timeout, toastr, socket) {
        console.log('ConversationCtrl ctrl loaded >>', $scope);

        $scope.editEnabled = {};
        $scope.data = {};
        $scope.loading = true;

        // Use the socket to get private chats in real time
        socket.on('get private chat', function(message) {
            if (message.users.indexOf($scope.currentUser._id) !== -1) {
                $scope.chatThread.chats.push(message);
                $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 250);
            }
        });

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
                $scope.chatThread = res.data.chatThread;
                $scope.loading = false;
                $timeout(function() {
                    $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 300);
                }, 500);
            })
            .catch(function(error) {
                console.error(error);
                toastr.warning('Oops something went wrong...');
            });


        $scope.onError = function(err) {
            console.log(err);
            toastr.warning('Oops we couldn\'t send your message...');
        };

        $scope.beforeSubmit = function() {
            if (!$scope.chatThread || !$scope.chatThread._id) {
              console.log("LOOK HERE",$scope.chatThread);
                // Runs the first time a chat is started
                // Creates a thread to attach chats and users to
                $scope.data.users = [ $scope.currentUser._id, $scope.otherUser._id ];
                $scope.data.chats = [];
                $scope.data.chat = {
                    users: [ $scope.currentUser._id, $scope.otherUser._id ],
                    message: $scope.data.message,
                    unread: true,
                    sender: $scope.currentUser._id,
                    receiver: $scope.otherUser._id,
                    _dateSent: new Date()
                };
            } else if ($scope.chatThread && $scope.chatThread._id) {
                // Runs every subsequent submit
                // Now the form is PUT request that simply creates a new Chat and
                // adds that chat to the current thread

                  // $scope.chatThread.chats.forEach(function(el){
                  //   console.log(el.unread);
                  // })
                  //

                console.log('chatThread is existing');
                console.log("LOOKING FOR USER STATUS", $scope.currentUser);
                $scope.data.chatThread = angular.copy($scope.chatThread);
                $scope.data.chat = {
                    chatThread: $scope.chatThread._id,
                    users: [ $scope.currentUser._id, $scope.otherUser._id ],
                    message: $scope.data.message,
                    unread: true,
                    sender: $scope.currentUser._id,
                    receiver: $scope.otherUser._id,
                    _dateSent: new Date()
                };
                if ($scope.chatThread.unread === true){
                  console.log("hey");
                }
            }
            socket.emit('new private chat', $scope.data.chat);
        };

        $scope.deleteChatMessage = function(chatMessage) {
            $http.delete('/api/chats/' + chatMessage._id)
                .then(function(res) {
                    console.log(res);
                    if (res.status == 200 ) {
                        toastr.success('Your message was deleted successfully!');
                        $scope.chatThread.chats = $scope.chatThread.chats.filter(function(chat) {
                            return chat._id !== chatMessage._id;
                        });
                    } else {
                        toastr.warning('There was an error deleting your message. Please try again.');
                    }
                })
                .catch(function(err) {
                    console.error(err);
                    toastr.warning('There was an error deleting your message. Please try again.');
                });
        };

        $scope.disableMessageEdit = function(index) {
            $scope.editEnabled[index] = false;
        };

        $scope.enableMessageEdit = function(index) {
            $scope.editEnabled[index] = true;
        };

        $scope.editChatMessage = function(chatMessage, index) {
            chatMessage._dateUpdated = new Date();
            $http.put('/api/chats/' + chatMessage._id, chatMessage)
                .then(function(res) {
                    if (res.status === 200 ) {
                        toastr.success('Your message was edited successfully!');
                        $scope.editEnabled[index] = false;
                    } else {
                        toastr.warning('There was an error editing your message. Please try again.');
                    }
                })
                .catch(function(err) {
                    console.error(err);
                    toastr.warning('There was an error editing your message. Please try again.');
                });
        };

        $scope.afterSubmit = function(res) {
            // either update the chatThread or add the new chat
            if (res.data.chat) {
                $scope.chatThread.chats.push(res.data.chat);
            } else if (res.data.chatThread) {
                $scope.chatThread = res.data.chatThread;
            }

            // reset input
            $scope.data = {};

            // Scroll to the bottom of the chat container div
            $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 250);
        };
    });
