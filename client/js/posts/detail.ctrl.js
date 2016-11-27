'use strict';

angular.module('posts')
    .controller('PostDetailCtrl', function($scope, $http, $stateParams, toastr) {

        console.log('PostDetailCtrl loaded >>', $scope);

        refreshPost();

        $scope.data = {};

        $scope.tinymceOptions = {
            resize: false,
            menubar:false,
            statusbar: false
        };

        $scope.$on('Post:refresh', function() {
            refreshPost();
        });

        function refreshPost() {
            $scope.loading = true;
            $http.get('/api/posts/' + $stateParams.id)
                .then(function(res) {
                    $scope.post = res.data;
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('Whoops, there was an error loading that post. Please try again.');
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }

        $scope.submitReply = function() {

            $scope.post.replies.push({
                user: angular.copy($scope.currentUser),
                _createdDate: new Date(),
                content: $scope.data.reply.content
            });

            return $http.put('/api/posts/' + $scope.post._id, $scope.post)
                .then(function(res) {
                    console.log(res);
                    toastr.success('Your reply was added successfully.');
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error editing this post. Please close this window and try again.')
                });
        };

    });
