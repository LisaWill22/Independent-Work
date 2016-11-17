'use strict';

angular.module('chat')
    .controller('ChatCtrl', function($scope, $http, toastr) {
        console.log('Chat ctrl loaded >>', $scope);

        $scope.data;

        $http.get('/api/users')
            .then(function(res) {
                $scope.users = res.data;
            });

        $scope.sendMessage = function() {
            // Build out message
            var message = {
                thread: $scope.currentUser._id + '-' + $scope.data.recipient._id,
                sender: $scope.currentUser._id,
                recipient: $scope.data.recipient._id,
                message: $scope.data.message,
                unread: true,
                _dateSent: new Date()
            }

            // Send message to API
            $http.post('/chats', message)
                .then(function(res) {
                    toastr.success('Message sent!');
                    $scope.data = {};
                })
                .catch(function(err) {
                    toastr.error('There was a problem sending your message. Please try again.');
                    console.log(err);
                })
        }
    });
