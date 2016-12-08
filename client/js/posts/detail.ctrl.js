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

        $scope.openDeleteReplyModal = function(index, reply) {
            $scope.replyToDeleteIndex = index;
            $scope.replyToDelete = reply;
            $scope.deleteReplyModalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'posts/views/delete-reply-modal.html',
                controller: 'DeleteReplyModalCtrl',
                size: 'md'
            });
        };

        $scope.openEditPostModal = function(post) {
            $scope.postToEdit = post;
            $scope.postModalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'posts/views/create-post-modal.html',
                controller: 'EditPostModalCtrl',
                size: 'md'
            });
        };

        $scope.submitReply = function() {
            submitReply ();
        };

        function refreshPost() {
            $scope.loading = true;
            return $http.get('/api/posts/' + $stateParams.id + '/includes=user')
                .then(function(res) {
                    console.log(res);
                    $scope.post = res.data.post;
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

    })
    .controller('DeleteReplyModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, $q, toastr) {

        console.log('DeleteReplyModalCtrl >>', $scope);

        $scope.close = function() {
            $uibModalInstance.close();
        };

        $scope.deleteReply = function() {
            deleteReply()
                .then(function(res) {
                    console.log(res);
                    toastr.success('Your reply was deleted successfully.');
                    $scope.$emit('Post:refresh');
                    $uibModalInstance.close();
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error deleting your reply. Please close this window and try again.');
                });
        };

        function deleteReply (index) {
            console.log($scope.replyToDeleteIndex);
            $scope.post.replies = $scope.post.replies.filter(function(reply) {
                return !angular.equals(reply, $scope.replyToDelete);
            });
            return $http.put('/api/posts/' + $scope.post._id, $scope.post);
        }

    });
