angular.module('independent-work-app')
    // Animated scoll to element id
    .directive('scrollTo', function() {
        return {
            restrict: 'A',
            link: function(scope, el, attrs) {
                if (attrs.scrollTo) {
                    if (attrs.scrollToOffset) {
                        el.on('click', function(e) {
                            $('html, body').animate({
                                scrollTop: $('#' + attrs.scrollTo).offset().top - parseInt(attrs.scrollToOffset)
                            }, 650);
                        });
                    } else {
                        el.on('click', function(e) {
                            $('html, body').animate({
                                scrollTop: $('#' + attrs.scrollTo).offset().top
                            }, 650);
                        });
                    }
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
    });
