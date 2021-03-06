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
                url: '/conversation/:friendId',
                templateUrl: 'chat/views/conversation.html',
                controller: 'ChatConversationCtrl'
            })
            .state('app.chat.list', {
                url: '/messages',
                templateUrl: 'chat/views/chat-list.html',
                controller: 'ChatListCtrl'
            })
            .state('app.chat.list.detail', {
                url: '/conversation/:friendId',
                templateUrl: 'chat/views/_conversation.html',
                controller: 'ChatConversationCtrl'
            });
    });
