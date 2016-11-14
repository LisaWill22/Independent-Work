'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function($scope, $rootScope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        // Load in postings
        if ($scope.contractor) {
            $scope.loading = true;
            getPosts();
        }

        $rootScope.$on('Posts:reload', function() {
            $scope.loading = true;
            getPosts();
        });

        function getPosts() {
            return $http.get('/api/posts')
                .then(function(res) {
                    $timeout(function() {
                        $scope.items = res.data;
                        $scope.items.forEach(function(item) {
                            item.lastPost = {};
                            item.lastPost.date = new Date ();
                            item.lastPost.user = {};
                            item.lastPost.user.firstName = 'James';
                            item.lastPost.user.lastName = 'Doesn';
                        });
                        $scope.loading = false;
                    }, 1000);
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error getting projects. Please try again');
                });
        }

        // Load all contractors (paginated?)
        if ($scope.employer) {
            $scope.loading = true;
            $http.get('/api/users?role=contractor')
                .then(function(res) {
                    $scope.items = res.data;
                    $scope.loading = false;
                    $scope.items = _.filter(res.data, function(user) {
                        return user.roles.indexOf('contractor') !== -1;
                    });
                    console.log($scope.items);
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error getting projects. Please try again');
                });
        }

    });
