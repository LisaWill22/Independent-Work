'use strict';

angular.module('posts')
    .controller('PostDetailCtrl', function($scope, $http, $stateParams, $uibModal, toastr) {

        console.log('PostDetailCtrl loaded >>', $scope);

        refreshPost();

        $scope.data = {};
        $scope.data.reply = {};

        $scope.$on('Post:refresh', function() {
            refreshPost();
        });

        $scope.openEditPostModal = function(post) {
            $scope.postToEdit = post;
            $scope.postModalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'posts/views/create-post-modal.html',
                controller: 'EditPostModalCtrl',
                size: 'md',
            });
        };

        $scope.submitReply = function() {
            submitReply ();
        };

        function refreshPost() {
            $scope.loading = true;
            return $http.get('/api/posts/' + $stateParams.id)
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

        function submitReply () {
            if (!$scope.post.replies) {
                $scope.post.replies = [];
            }

            $scope.post.replies.push({
                user: angular.copy($scope.currentUser),
                _createdDate: new Date(),
                content: $scope.data.reply.content
            });

            $scope.data.reply.content = '';

            return $http.put('/api/posts/' + $scope.post._id, $scope.post)
                .then(function(res) {
                    console.log(res);
                    toastr.success('Your reply was added successfully.');
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error editing this post. Please close this window and try again.')
                    $scope.post.replies.pop();
                })
                .finally(function() {

                });
        }

    });
