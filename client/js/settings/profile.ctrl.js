'use strict';

angular.module('settings')
	.controller('ProfileCtrl', function($scope, $rootScope, $http, $q, $timeout, toastr, Upload, states) {

		console.log('ProfileCtrl loaded >>', $scope);

		$scope.data = angular.copy($scope.currentUser);
		$scope.data.showEmail = 'true';
		$scope.states = states;

		// Placeholder for the list of all skills returned from the api
		var allSkills;

		if ($scope.contractor) {
			$http.get('/api/skills')
				.then(function(res) {
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
				});
		}

		// Saves a skill to the api - called in profile save to save new skills
		function saveSkill(skill) {
			return $http.post('/api/skills', skill);
		}

        $scope.skills = $scope.skills.map(function(skill) {
            return {
                id: skill._id,
                title: skill.name
            };
        });

		$scope.myOptions = [{
			id: 1,
			title: 'Spectrometer'
		}, {
			id: 2,
			title: 'Star Chart'
		}, {
			id: 3,
			title: 'Laser Pointer'
		}];

		$scope.myConfig = {
			create: true,
			valueField: 'id',
			labelField: 'title',
			delimiter: '|',
			placeholder: 'Pick something',
			onInitialize: function(selectize) {
				// receives the selectize object as an argument
			},
			// maxItems: 1
		};

		$scope.onError = function() {
			toastr.warning('Whoops, something went wrong...\n ' + err);
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

        $scope.onError = function() {
            toastr.warning('Whoops, something went wrong...\n ' + err);
        };

		$scope.afterSubmit = function(res) {
			$scope.$emit('Session:refresh', res.data.user);
			toastr.success('Your profile saved successfully!');
		};

		// Runs when user uploads a profile picture, not when they click submit
		// -- does not get submitted with "Save Profile"
		$scope.upload = function(dataUrl, name) {
			$scope.uploadInProgresss = true;
			$scope.uploadFinished = false;
			Upload.upload({
					url: '/api/users/' + $scope.currentUser._id + '/profile-image',
					data: {
						file: Upload.dataUrltoBlob(dataUrl, name)
					},
				}).then(function(response) {
					$timeout(function() {
						$scope.uploadInProgresss = false;
						$scope.uploadFinished = true;
						$scope.result = response.data;
						$scope.$emit('Session:refresh', response.data.user);
						toastr.success('Your profile image was updated successfully');
						$scope.picFile = null;
					});

					$timeout(function() {
						$scope.hideSuccess = true;
					}, 2000);
				}, function(response) {
					if (response.status > 0) $scope.errorMsg = response.status +
						': ' + response.data;
				}, function(evt) {
					$scope.progress = parseInt(100.0 * evt.loaded / evt.total);
				})
				.finally(function() {
					$scope.uploadInProgresss = false;
					$scope.uploadFinished = true;
					$scope.picFile = null;
				})
		};
	});
