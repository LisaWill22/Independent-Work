'use strict';

angular.module('chat', [
        'ui.router'
    ]).config(function($stateProvider) {
        $stateProvider
            .state('app.chat', {
                abstract: true,
                controller: 'ChatCtrl',
                views: {
                    'container': { templateUrl: 'chat/views/index.html' }
                }
            })
            .state('app.chat.list', {
                url: '/messages',
                templateUrl: 'chat/views/chat-list.html',
                controller: 'ChatListCtrl'
            })
            .state('app.chat.detail', {
                url: '/logout',
                templateUrl: 'chat/views/logout.html',
                controller: 'LogoutCtrl'
            })
    });
