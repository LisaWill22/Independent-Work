angular.module('independent-work-app')
    // Animated scoll to element id
    .directive('scrollTo', function() {
        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                if (attrs.scrollTo) {
                    el.on('click', function(e) {
                        $('html, body').animate({
                            scrollTop: $('#'+attrs.scrollTo).offset().top
                        }, 650);
                    });
                }
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
