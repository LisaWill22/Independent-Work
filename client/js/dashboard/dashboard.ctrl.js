'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function($scope, $rootScope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        $rootScope.hideFooter = true;

        $scope.filtersCollapsed = true;
        $scope.data = {};

        // Load in postings
        if ($scope.contractor) {
            $scope.loading = true;
            getPosts();
        }

        // Load all contractors (paginated?)
        if ($scope.employer) {
            $scope.loading = true;
            getContractors();
        }

        $rootScope.$on('Posts:reload', function() {
            $scope.loading = true;
            getPosts();
        });

        $scope.doSearch = function() {
            $http.get('/sapi/search/contractors?query=' + $scope.data.query)
                .then(function(res) {
                    console.log(res);
                    if (res.data.users && res.data.users.length) {
                        $scope.items = _.filter(res.data.users, function(user) {
                            return user.roles && user.roles.indexOf('contractor') !== -1;
                        });
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('Dang boss! Something went wrong...');
                });
        };

        function getPosts() {
            return $http.get('/api/posts/dashboard/includes=skills,user')
                .then(function(res) {
                    $timeout(function() {
                        console.log(res);
                        $scope.items = _.sortBy(res.data.posts, '_createdDate').reverse();
                        $scope.loading = false;
                    }, 1000);
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error getting projects. Please try again');
                });
        }

        function getContractors() {
            return $http.get('/api/users?role=contractor')
                .then(function(res) {
                    console.log(res);
                    $scope.items = res.data;
                    $scope.loading = false;
                    $scope.items = _.filter(res.data, function(user) {
                        return user.roles && user.roles.indexOf('contractor') !== -1;
                    });
                    console.log($scope.items);
                })
                .catch(function(err) {
                    console.log(err);
                    toastr.warning('There was an error getting projects. Please try again');
                });
        }

    });
