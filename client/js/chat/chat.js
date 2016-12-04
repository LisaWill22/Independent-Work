'use strict';

angular.module('chat', [
        'ui.router'
    ]).config(function($stateProvider) {
        $stateProvider
            .state('app.chat', {
                abstract: true,
                views: {
                    'container': {
                        templateUrl: 'chat/views/index.html',
                        controller: 'ChatCtrl'
                    }
                }
            })
            .state('app.chat.conversation', {
                url: 'conversation/:contractorSlug',
                templateUrl: 'chat/views/conversation.html',
                controller: 'ChatConversationCtrl'
            })
            .state('app.chat.list', {
                url: '/messages',
                templateUrl: 'chat/views/chat-list.html',
                controller: 'ChatListCtrl'
            })
            .state('app.chat.list.detail`', {
                url: '/:id',
                templateUrl: 'chat/views/chat-detail.html',
                controller: 'ChatDetailCtrl'
            });
    });
