angular.module('independent-work-app')
    .controller('AppCtrl', function($scope) {
        console.log('main app ctrl loaded >> ', $scope);


    })
    .directive('slimHeader', function ($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                 if (this.pageYOffset >= 300) {
                     scope.slimHeader = true;
                 } else {
                     scope.slimHeader = false;
                 }
                scope.$apply();
            });
        };
});
