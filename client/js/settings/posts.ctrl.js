'use strict';

angular.module('settings')
    .controller('PostsSettingsCtrl', function($scope, $http, $uibModal) {

        console.log('PostsSettingsCtrl loaded >>', $scope);

        getPosts();

        $scope.$on('Posts:refresh', function() {
            getPosts();
        })

        function getPosts() {
            $scope.loading = true;
            return $http.get('/api/users/' + $scope.currentUser._id + '/posts')
                .then(function(res) {
                    $scope.posts = res.data.posts;
                })
                .catch(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                })
        }

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
        }

        $scope.openDeletePostModal = function(post) {
            $scope.postToDelete = post;
            $scope.postModalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'posts/views/delete-post-modal.html',
                controller: 'DeletePostModalCtrl',
                size: 'md',
            });
        }
    })
    .controller('DeletePostModalCtrl', function($scope, $uibModalInstance, $rootScope, $http, toastr) {

        $scope.deletePost = function() {
            return $http.delete('/api/posts/' + $scope.$parent.postToDelete._id)
                .then(function(res) {
                    $rootScope.$broadcast('Posts:refresh');
                    $uibModalInstance.close();
                    toastr.success('Your post was deleted successfully.');
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error deleting this post. Please close this window and try again.')
                })
        }

        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    })
    .controller('EditPostModalCtrl', function($scope, $uibModalInstance, $http, $rootScope, toastr) {
        $scope.data = $scope.$parent.postToEdit;

        $scope.updatePost = function() {
            return $http.put('/api/posts/' + $scope.$parent.postToEdit._id, $scope.data)
                .then(function(res) {
                    console.log(res);
                    $rootScope.$broadcast('Posts:refresh');
                    $uibModalInstance.close();
                    toastr.success('Your post was edited successfully.');
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error editing this post. Please close this window and try again.')
                })
        }


        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    })
