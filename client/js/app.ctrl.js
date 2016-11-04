angular.module('independent-work-app')
	.controller('AppCtrl', function($scope, $rootScope, $http, $state, $localStorage) {
		console.log('main app ctrl loaded >> ', $scope);

		// Listen for session refreshes and update the user
		$rootScope.$on('Session:refresh', function(e, user, session) {
			$scope.currentUser = user;
		});

		// Set up the local storage
		$scope.$storage = $localStorage;

		// If there is a userId in local storage, grab it from the db and send to the dash
		if ($scope.$storage.userId) {
			$http.get('/api/users/' + $scope.$storage.userId)
				.then(function(res) {
					$scope.currentUser = res.data;
					$state.go('app.dashboard');
				})
				.catch(function(err) {
					console.error(err);
				})
				.finally(function() {

				});
		}

	})
	.directive('spinner', function() {
        return {
            restrict: 'EA',
            templateUrl: 'partials/spinner.html',
            link: function(scope, el, attrs) {
                console.log(attrs);
            }
        }
	})
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
