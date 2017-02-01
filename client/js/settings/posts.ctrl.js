'use strict';

angular.module('settings')
    .controller('PostsSettingsCtrl', function($scope, $http, $uibModal) {

        console.log('PostsSettingsCtrl loaded >>', $scope);

        function getPosts() {
            $scope.loading = true;
            return $http.get('/api/users/' + $scope.currentUser._id + '/posts')
                .then(function(res) {
                    console.log(res);
                    $scope.posts = _.chain(res.data.posts)
                                    .sortBy(function(post) {
                                        if (post.replies.length) {
                                            return post.replies[0]._createdDate;
                                        } else {
                                            return post._createdDate;
                                        }
                                    })
                                    .reverse()
                                    .value();
                })
                .catch(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.loading = false;
                });
        }

        getPosts();

        $scope.$on('Posts:reload', function() {
            getPosts();
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
        };
    })
    .controller('DeletePostModalCtrl', function($scope, $uibModalInstance, $rootScope, $http, toastr) {

        $scope.deletePost = function() {
            return $http.delete('/api/posts/' + $scope.$parent.postToDelete._id)
                .then(function(res) {
                    $rootScope.$broadcast('Posts:reload');
                    $uibModalInstance.close();
                    toastr.success('Your post was deleted successfully.');
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error deleting this post. Please close this window and try again.')
                });
        };

        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    })
    .controller('EditPostModalCtrl', function($scope, $uibModalInstance, $http, $rootScope, $q, toastr) {
        $scope.data = angular.copy($scope.$parent.postToEdit);

        $http.get('/api/skills')
            .then(function(res){
                $scope.skills = res.data;
            })
            .catch(function(err) {
                console.log(err);
                $scope.skills = [];
            });

        $scope.onError = function(err) {
            console.log(err);
            toastr.warning('There was an error creating your project. Please try again.')
        };

        // Saves a skill to the api - called in profile save to save new skills
        function saveSkill (skill) {
            return $http.post('/api/skills', skill);
        }

        $scope.beforeSubmit = function() {
            $scope.data._updatedDate = new Date();
            $scope.data.user = $scope.currentUser._id;
            var skillsToSave = [];
            var promises = [];

            if ($scope.data.skills) {
                $scope.data.skills.forEach(function(skill) {
                    var skillExists = $scope.skills.find(function(existingSkill) {
                        return existingSkill.name.toLowerCase() === skill.name.toLowerCase();
                    })
                    if (!skillExists) {
                        skillsToSave.push(skill);
                    }
                });

                skillsToSave.forEach(function(skill) {
                    var promise = saveSkill(skill);
                    promises.push(promise);
                });

                if (promises.length) {
                    $q.all(promises).then(function(allResults) {
                        if (allResults.length) {
                            console.log('skills uploaded > ', allResults);
                        } else {
                            console.log('no skills to up load :()');
                        }
                    });
                }
            }
        };

        $scope.afterSubmit = function(res) {
            if (res.status === 200) {
                console.log(res);
                toastr.success('Post updated successfully!');
                $rootScope.$broadcast('Posts:reload');
                $rootScope.$broadcast('Post:refresh');
                $uibModalInstance.close();
            } else {
                console.log(res);
                toastr.warning('There was an error creating your project. Please try again.');
            }
        };

        // Adds back skill to list of options on removal
        $scope.onSkillRemove = function(item, model) {
            if ($scope.skills.indexOf(item) === -1) {
                $scope.skills.push(item);
            }
        };

        // Adds a skill tag when it does not exist yet
        $scope.addSkill = function(skillName) {

            var newSkill;
            var skillNameExists = $scope.skills.find(function(skill) {
                return skillName.toLowerCase() === skill.name.toLowerCase();
            });

            // Prevent the skill from adding if it already exists
            if (!skillNameExists) {
                newSkill = {
                    name: skillName,
                    description: null,
                    cateogries: [],
                    _created: new Date()
                };
            } else {
                newSkill = null;
            }

            return newSkill;
        };

        $scope.cancel = function() {
            $uibModalInstance.close();
        };
    });
