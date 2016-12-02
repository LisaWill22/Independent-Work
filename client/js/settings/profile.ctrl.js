'use strict';

angular.module('settings')
    .controller('ProfileCtrl', function($scope, $rootScope, $http, $q, $timeout, toastr, Upload, states) {

        console.log('ProfileCtrl loaded >>', $scope);

        $scope.data = angular.copy($scope.currentUser);
        $scope.data.showEmail = 'true';
        $scope.states = states;

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

        // Placeholder for the list of all skills returned from the api
        var allSkills;

        // Saves a skill to the api - called in profile save to save new skills
        function saveSkill (skill) {
            return $http.post('/api/skills', skill);
        }

        // TODO: Move this to base64 encoded on the user and make a directive for proilfe images
        // Gets the profile image
        function getProfileImg() {
            // Get profile image
            return $http.get('/api/users/' + $scope.currentUser._id + '/profile-image')
                .then(function(res) {
                    $scope.profileImageUrl = res.data.image;
                })
                .catch(function(err) {
                    console.log(err);
                });
        }

        $scope.onError = function () {
            toastr.warning('Whoops, something went wrong...\n ' + err);
        };

        $scope.beforeSubmit = function() {
            delete $scope.data.image;
            $scope.data.messages = {};

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
                    if (allResults.length) {
                        console.log('skills uploaded > ', allResults);
                    } else {
                        console.log('no skills to up load :()');
                    }
                });
            }
        };

        $scope.afterSubmit = function(res) {
            $scope.$emit('Session:refresh', res.data.user);
            toastr.success('Your profile saved successfully!');
        };

        // Runs when user uploads a profile picture, not when they click submit
        // -- does not get submitted with "Save Profile"
        $scope.upload = function (dataUrl, name) {
            $scope.uploadInProgresss = true;
            $scope.uploadFinished = false;
            Upload.upload({
                url: '/api/users/' + $scope.currentUser._id + '/profile-image',
                data: {
                    file: Upload.dataUrltoBlob(dataUrl, name)
                },
            }).then(function (response) {
                $timeout(function () {
                    $scope.uploadInProgresss = false;
                    $scope.uploadFinished = true;
                    $scope.result = response.data;
                    $rootScope.$broadcast('ProfileImg:refresh');
                    $scope.picFile = null;
                    getProfileImg()
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status
                    + ': ' + response.data;
            }, function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
        };
    });
