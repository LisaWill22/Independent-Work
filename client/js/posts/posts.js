'use strict';

angular.module('posts', [
        'ui.router',
        'ngAnimate'
    ]).config(function($stateProvider){

        $stateProvider
            .state('app.posts', {
                url: '/posts',
                views: {
                    'container': {
                        controller: 'PostsCtrl',
                        templateUrl: 'posts/views/index.html'
                    }
                }
            });
    });
