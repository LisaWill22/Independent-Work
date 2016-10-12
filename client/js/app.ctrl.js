angular.module('independent-work-app')
    .controller('AppCtrl', function($scope, $rootScope) {
        console.log('main app ctrl loaded >> ', $scope);

        $rootScope.$on('Session:refresh', function(e, user, session) {
            console.log(e);
            $scope.currentUser = user;
        })

    })
    .directive('slimHeader', function ($window) {
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
