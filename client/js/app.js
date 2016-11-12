var app = angular.module('independent-work-app', [
	'ngAnimate',
	'ngSanitize',
	// third party components
	'toastr',
	'ui.router',
	'ui.select',
	'ui.bootstrap',
	'ngStorage',
	'angular-loading-bar',
	// IW modules
	'app.templates',
	'home',
	'auth',
	'signup',
	'dashboard',
	'settings',
	// Generic Services
	'SessionService'
]);

app.config(function($stateProvider, $urlRouterProvider, $localStorageProvider, $compileProvider, toastrConfig, uiSelectConfig) {

	// Send the user to the home page if they get a bad route
	$urlRouterProvider.otherwise('/');

	// Register the base app state
	$stateProvider
		.state('app', {
			templateUrl: 'partials/layout.html',
			controller: 'AppCtrl',
			abstract: true,
			resolve: {
				session: function(Session) {
					return Session.refreshSession();
				},
				skills: function($http) {
					return $http.get('/api/skills');
				}
			}
		});

	// Set the toastr configs
	angular.extend(toastrConfig, {
		positionClass: 'toast-bottom-right'
	});

	// Set up local storage prefix
	$localStorageProvider.setKeyPrefix('iw-app');

	// Performance enhancement
	$compileProvider.debugInfoEnabled(false);
});

app.run(function($timeout, $rootScope) {
	console.log('App is bootstrapped! >', this);

	// override ui-router scrolling
	// add google analytics tracking
	$rootScope.$on('$stateChangeSuccess', function() {
		window.scrollTo(0, 0);
		// log the google analytics event
		//   window.ga('send', 'pageview', {
		//     page: $location.url()
		//   });
	});

	// handles initial page loading animations
	// $timeout(function () {
	//     $('#app-container').css('opacity', 1);
	//     $('#home-loading').css('opacity', 0);
	// }, 1000);
	//
	// $timeout(function () {
	//     $('#home-loading').remove();
	// }, 1100);
})

// Used in UI select
app.filter('propsFilter', function() {
	return function(items, props) {
		var out = [];

		if (angular.isArray(items)) {
			items.forEach(function(item) {
				var itemMatches = false;

				var keys = Object.keys(props);
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			// Let the output be the input untouched
			out = items;
		}

		return out;
	};
});
