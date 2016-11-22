'use strict';

angular.module('independent-work-app')
	.factory('socket', function($rootScope) {
		var socket = io.connect('http://localhost:3000');
		return {
			on: function(eventName, callback) {
				socket.on(eventName, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						callback.apply(socket, args);
					});
				});
			},
			emit: function(eventName, data, callback) {
				socket.emit(eventName, data, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};
	});

angular.module('independent-work-app')
	.controller('AppCtrl', function(session, skills, $scope, $rootScope, $http, $state, $localStorage, $uibModal, socket) {

		console.log('main app ctrl loaded >> ', $scope);

		// Socket listeners
		// ================
		socket.on('chat message', function(data) {
			alert(data.message);
		});

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
			// Go to home if not logged in
			$state.go('app.home');
		}

		// Listen for session refreshes and update the user
		$rootScope.$on('Session:refresh', function(e, user, session) {
			refreshSession(user);
			console.log('currentuser is >>', $scope.currentUser);
		});

		// Opens the add posting modal
		// Only visible if account type is employer
		$scope.openCreatePostModal = function() {
			openCreatePostModal();
		};

		function openCreatePostModal() {
			$scope.modalInstance = $uibModal.open({
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
	.controller('CreatePostModalCtrl', function($scope, $rootScope, $uibModalInstance, $http, toastr) {

		console.log('CreatePostModalCtrl >>', $scope);

		$scope.data = {};

		$scope.createPost = function() {
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
					yOffset = 80;
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
	.filter('sentenceCase', function() {
		return _.memoize(function(x) {
			var capitalize, fmt;

			if (!angular.isString(x)) {
				return;
			}
			x = x.toLowerCase();
			capitalize = function(str) {
				str += '';
				return str.charAt(0).toUpperCase() + str.slice(1);
			};
			fmt = function(y) {
				var capitalized;

				return capitalized = capitalize($.trim(y));
			};
			x = _.map(x.split('.'), function(z) {
				return fmt(z);
			}).join('. ');
			x = _.map(x.split('!'), function(z) {
				return fmt(z);
			}).join('! ');
			return x = _.map(x.split(','), function(z) {
				return z;
			}).join(', ');
		});
	});
