'use strict';

var mailChimpUrl = '//independentwork.us13.list-manage.com/subscribe/post?u=1caaabe4f2e84eeb4df6c6745&amp;id=fb2065f650';

angular.module('independent-work-app')
	.controller('AppCtrl', function(session, skills, $scope, $rootScope, $http, $state, $localStorage, $uibModal, socket) {

		console.log('main app ctrl loaded >> ', $scope);

		// Set up the local storage
		$scope.$storage = $localStorage;
		$scope.skills = skills.data;
		$scope.userMenuOpen = false;

        // Set up some defaults for the WYSIWYG editor
		$scope.tinymceOptions = {
			resize: false,
			menubar:false,
			statusbar: false
		};

		if (session && session.data) {
            // get the current state name
			let stateName = $state.$current.name;

            // update the currenuser and session objects
			refreshSession(session.data);

			// Redirect to the right place
			if (stateName !== 'app.home') {
				$state.go(stateName);
			} else {
				// If user goes to the base url and logged in, they'll
				// redirect to the dashboard
				$state.go('app.dashboard');
			}
		} else {
			// // Go to home if not logged in
			$state.go('app.home');
		}

		// Listen for session refreshes and update the user
		$rootScope.$on('Session:refresh', function(e, user, session) {
			refreshSession(user);
			console.log('currentuser is >>', $scope.currentUser);
			if (!user) {
				$scope.profileImageUrl = null;
			}
		});

		// Opens the modal for user to signup to mailchimp list
		$scope.openMailChimpModal = function() {
			openMailChimpModal();
		};

		function openMailChimpModal() {
			$scope.mcModalInstance = $uibModal.open({
				animation: true,
				scope: $scope,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'home/views/add-to-mc-modal.html',
				controller: 'addToMailChimpModalCtrl',
				size: 'md'
			});
		}

		// Opens the add posting modal
		// Only visible if account type is employer
		$scope.openCreatePostModal = function() {
			openCreatePostModal();
		};

		function openCreatePostModal() {
			$scope.postModalInstance = $uibModal.open({
				animation: true,
				scope: $scope,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'posts/views/create-post-modal.html',
				controller: 'CreatePostModalCtrl',
				size: 'md'
			});
		}

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

		function refreshSession(user) {
			// Set the app's currentUser
			$scope.currentUser = user;

			if (user) {
				// Set the socket up
                socket.emit('message', {
                    type: 'setUsername',
                    user: $scope.currentUser._id
                });

				// Set the role for UI toggling
				$scope.contractor = user.roles.find(function(role) {
					return role === 'contractor';
				});

				$scope.employer = user.roles.find(function(role) {
					return role === 'employer';
				});
			}
		}
	})
	.controller('addToMailChimpModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, toastr) {
		console.log('CreatePostModalCtrl >>', $scope);

		$scope.data = {};
		$scope.success = false;

		$scope.addToList = function() {
			$http.post(mailChimpUrl, $scope.data)
				.then(function(res) {
					console.log(res);
				})
				.catch(function(err) {
					console.log(err);
				})
		}
	})
	.controller('CreatePostModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, $q, toastr) {

		console.log('CreatePostModalCtrl >>', $scope);

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
            console.log('before sumit');
            $scope.data._createdDate = new Date();
			$scope.data.user = $scope.currentUser;
            var skillsToSave = [];
            var promises = [];

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

            $q.all(promises).then(function(allResults) {
                if (allResults.length) {
                    console.log('skills uploaded > ', allResults);
                } else {
                    console.log('no skills to up load :()');
                }
            });
        };

        $scope.afterSubmit = function(res) {
            if (res.status === 200) {
                toastr.success('Project created successfully!');
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
	})
