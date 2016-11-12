'use strict';

angular.module('settings')
    .controller('ProfileCtrl', function($scope, $http, $q, toastr) {

        console.log('ProfileCtrl loaded >>', $scope);

        $scope.data = angular.copy($scope.currentUser);
        $scope.data.showEmail = 'true';

        var allSkills;

        $scope.saveProfile = function() {

            if ($scope.contractor) {
                var skillsToSave = [];
                var promises = [];

                $scope.data.skills.forEach(function(skill) {
                    var skillExists = allSkills.find(function(existingSkill) {
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

                $q.all(promises).then(function(allResults) {
                    console.log(allResults);
                });
            }

            $http.put('/api/users/' + $scope.currentUser._id, $scope.data)
                .then(function(res) {
                    $scope.$emit('Session:refresh', res.data.user);
                    toastr.success('Your profile saved successfully!');
                })
                .catch(function(err) {
                    toastr.warning('Whoops, something went wrong...\n ' + err);
                })
                .finally(function() {

                });
        };

        if ($scope.contractor) {
            $http.get('/api/skills')
                .then(function(res){
                    allSkills = res.data;

                    $scope.skills = [];
                    allSkills.forEach(function(skill) {
                        var userHasSkill = $scope.data.skills.find(function(userSkill) {
                            return userSkill.name === skill.name;
                        });
                        if (!userHasSkill) {
                            $scope.skills.push(skill);
                        }
                    });
                })
                .catch(function(err) {
                    console.log(err);
                    $scope.skills = [];
                })
                .finally(function() {

                });
        }

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

        function saveSkill (skill) {
            return $http.post('/api/skills', skill);
        }
    });
