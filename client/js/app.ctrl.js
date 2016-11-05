'use strict';

angular.module('independent-work-app')
	.controller('AppCtrl', function($scope, $rootScope, $http, $state, $localStorage, session) {

		console.log('main app ctrl loaded >> ', $scope);

		// Set up the local storage
		$scope.$storage = $localStorage;

		if (session && session.data) {
			let stateName = $state.$current.name;
			$scope.currentUser = session.data;
			$scope.currentUser.messages = {};
			$scope.currentUser.messages.new = [
				{
					message: 'You rock!',
					from: 'Some other user'
				},
				{
					message: 'You totally rock!',
					from: 'Some other user'
				}
			];
			// Redirect to the right place
			// If user goes to the base url and logged in, they'll
			// redirect to the dashboard
			if (stateName !== 'app.home') {
				$state.go(stateName);
			} else {
				$state.go('app.dashboard');
			}
		}


		// Listen for session refreshes and update the user
		$rootScope.$on('Session:refresh', function(e, user, session) {
			// Set the app's currentUser
			$scope.currentUser = user;
			$scope.currentUser.messages = {};
			$scope.currentUser.messages.new = [
				{
					message: 'You rock!',
					from: 'Some other user'
				},
				{
					message: 'You totally rock!',
					from: 'Some other user'
				}
			];
		});

	})
	// Drop in spinner
	.directive('spinner', function() {
        return {
            restrict: 'EA',
            templateUrl: 'partials/spinner.html',
            link: function(scope, el, attrs) {
                console.log(attrs);
            }
        }
	})
	// Controls shrinking the header at a certain scroll point
	.directive('slimHeader', function($window) {
		return function(scope, element, attrs) {
			angular.element($window).bind('scroll', function() {
				if (this.pageYOffset >= 300) {
					scope.slimHeader = true;
				} else {
					scope.slimHeader = false;
				}
				scope.$apply();
			});
		};
	});
