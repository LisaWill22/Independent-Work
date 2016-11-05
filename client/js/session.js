'use strict';

angular.module('SessionService', [])
    .factory('Session', function($http, $localStorage) {
        return {
            refreshSession: function() {
                if ($localStorage.userId) {
                    return $http.get('/api/users/' + $localStorage.userId)
                } else {
                    return null;
                }
            }
        }
    });
