'use strict';

var mailChimpUrl = '//independentwork.us13.list-manage.com/subscribe/post?u=1caaabe4f2e84eeb4df6c6745&amp;id=fb2065f650';

angular.module('independent-work-app')
	.controller('AppCtrl', function(session, skills, $scope, $rootScope, $http, $state, $localStorage, $uibModal, socket) {

		console.log('main app ctrl loaded >> ', $scope);

		// MailChimp stuffs
		//independentwork.us13.list-manage.com/subscribe/post?u=1caaabe4f2e84eeb4df6c6745&amp;id=fb2065f650

		// Set up the local storage
		$scope.$storage = $localStorage;
		$scope.skills = skills.data;
		$scope.userMenuOpen = false;

		if (session && session.data) {
			let stateName = $state.$current.name;
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
			let stateName = $state.$current.name;
			// Go to home if not logged in
			$state.go(stateName);
		}

		// Listen for session refreshes and update the user
		$rootScope.$on('Session:refresh', function(e, user, session) {
			refreshSession(user);
			console.log('currentuser is >>', $scope.currentUser);
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

		function refreshSession(user) {
			// Set the app's currentUser
			$scope.currentUser = user;


			if (user) {
				// Set the socket up
				socket.emit('join', user);

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
	.controller('CreatePostModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, toastr) {

		console.log('CreatePostModalCtrl >>', $scope);

		$scope.data = {};

		$scope.updatePost = function() {
			$scope.data._createdDate = new Date();
			$scope.data.user = $scope.currentUser;
			$http.post('/api/posts', $scope.data)
				.then(function(res) {
					if (res.status === 200) {
						toastr.success('Project created successfully!');
						$rootScope.$broadcast('Posts:reload');
						$uibModalInstance.close();
					} else {
						console.log(res);
						toastr.warning('There was an error creating your project. Please try again.')
					}
				})
				.catch(function(err) {
					console.log(err);
					toastr.warning('There was an error creating your project. Please try again.')
				})
				.finally(function() {
					console.log('final');
				});
		};

		$scope.cancel = function() {
			$uibModalInstance.close();
		};
	});
