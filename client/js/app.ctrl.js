'use strict';

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
			var stateName = $state.$current.name;

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
                socket.emit('subscribe', $scope.currentUser._id);

				// Set the role for UI toggling
				$scope.contractor = user.roles.find(function(role) {
					return role === 'contractor';
				});

				$scope.employer = user.roles.find(function(role) {
					return role === 'employer';
				});
			}
		}
	});
