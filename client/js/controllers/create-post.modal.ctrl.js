'use strict';

angular.module('independent-work-app')
    .controller('CreatePostModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, $q, toastr) {

        console.log('CreatePostModalCtrl >>', $scope);

        console.log('definitely here');

        $scope.data = {};

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
            $scope.data._createdDate = new Date();
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
                toastr.success('Post created successfully!');
                $rootScope.$broadcast('Posts:reload');
                $uibModalInstance.close();
            } else {
                console.log(res);
                toastr.warning('There was an error creating your project. Please try again.')
            }
        }

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
