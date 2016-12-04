'use strict';

angular.module('chat')
    .controller('ChatListCtrl', function($scope, $http, $timeout, socket, toastr) {
        console.log('ChatListCtrl loaded >>', $scope);

        $scope.data = {};
        $scope.messages = [];

        socket.on('chat created', function (data) {
            console.log(data);
            //Push to new message to our $scope.messages
            $scope.messages.push(data);
            // TODO: move chat-box to directive
            $("#chat-container").animate({ scrollTop: $('.chat-container')[0].scrollHeight}, 500);
        });

        $scope.loading = true;
        // get the chats to populate the list on the left
        $http.get('/api/chats')
            .then(function(res) {
                $scope.loading = false;

                $scope.messages = res.data;
                $timeout(function() {
                    $("#chat-container").animate({ scrollTop: $('#chat-container')[0].scrollHeight}, 500);
                }, 250)

                // // filter out chats that are to/from this user
                // $scope.chats = res.data.filter(function(chat) {
                //     return chat.sender._id === $scope.currentUser._id;
                // });
                //
                // // group by recipient's first name
                // $scope.chats = _.groupBy($scope.chats, 'recipient.firstName');
            });

        $scope.sendMessage = function() {
            var room = 'general';

            // Build out message
            var message = {
                sender: {
                    _id: $scope.currentUser._id,
                    firstName: $scope.currentUser.firstName,
                    lastName: $scope.currentUser.lastName,
                    email: $scope.currentUser.email
                },
                message: $scope.data.message,
                unread: true,
                _dateSent: new Date()
            };

            // Emit to all users
            socket.emit('new chat', {
                room: 'general',
                message: message,
                username: message.sender.email
            });

            $scope.data.message = '';
        }

    });
