'use strict';

angular.module('independent-work-app')
	.controller('AppCtrl', function(session, skills, $scope, $rootScope, $http, $state, $localStorage, $uibModal) {

		console.log('main app ctrl loaded >> ', $scope);

		// Set up the local storage
		$scope.$storage = $localStorage;

		$scope.skills = skills.data;

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
			// Go to home if not logged in
			$state.go('app.home');
		}

		// Listen for session refreshes and update the user
		$rootScope.$on('Session:refresh', function(e, user, session) {
			console.log(user);
			refreshSession(user);
			console.log('currentuser is >>', $scope.currentUser);
		});

		// Opens the add posting modal
		// Only visible if account type is employer
		$scope.openAddProjectModal = function() {
			console.log('open');
			openAddProjectModal();
		};

		function openAddProjectModal() {
			$scope.modalInstance = $uibModal.open({
				animation: true,
				scope: $scope,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'projects/views/add-project-modal.html',
				controller: 'AddProjectModalCtrl',
				size: 'md'
			});
		}

		function refreshSession(user) {
			// Set the app's currentUser
			$scope.currentUser = user;

			if (user) {
				// Set the role for UI toggling
				$scope.contractor = user.roles.find(function(role) {
					return role === 'contractor';
				});
				$scope.employer = user.roles.find(function(role) {
					return role === 'employer';
				});
				$scope.currentUser.messages = {};
				$scope.currentUser.messages.new = [{
					message: 'You rock!',
					from: 'Some other user'
				}, {
					message: 'You totally rock!',
					from: 'Some other user'
				}];
			}
		}
	})
	// Drop in spinner
	.directive('spinner', function() {
		return {
			restrict: 'EA',
			templateUrl: 'partials/spinner.html'
		}
	})
	// Controls shrinking the header at a certain scroll point
	.directive('slimHeader', function($window, $state) {
		return function(scope, element, attrs) {
			angular.element($window).bind('scroll', function() {
				var yOffset;

				if ($state.includes('home')) {
					yOffset = 300;
				} else {
					yOffset = 100;
				}

				if (this.pageYOffset >= yOffset) {
					scope.slimHeader = true;
				} else {
					scope.slimHeader = false;
				}

				scope.$apply();
			});
		};
	})
	.controller('AddProjectModalCtrl', function($scope, $uibModalInstance, $http, toastr) {

		console.log('AddProjectModalCtrl >>', $scope);

		$scope.data = {};
		console.log($scope.skills);

		$scope.createProject = function() {
			console.log('adding');
			$scope.data.employer = $scope.currentUser;
			$http.post('/api/projects', $scope.data)
				.then(function(res) {
					console.log(res);
					if (res.status === 200) {
						toastr.success('Project created successfully!');
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
	})
