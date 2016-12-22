'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function($scope, $rootScope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        $rootScope.hideFooter = true;
        $scope.searchDone = false;
        $scope.filtersCollapsed = true;

        $scope.data = {};
        $scope.data.query = '';

        // Load in postings
        if ($scope.contractor) {
            $scope.loading = true;
            getPosts();
        }

        var dbSearch = _.throttle(doSearch);

        function doSearch () {
            $scope.loading = true;
            $scope.searchDone = false;
            $http.get('/sapi/search/contractors?query=' + $scope.data.query)
                .then(function(res) {
                    if (res.data.users && res.data.users.length) {
                        $scope.items = _.filter(res.data.users, function(user) {
                            return user.roles && user.roles.indexOf('contractor') !== -1 && user.firstName;
                        });
                    } else {
                        $scope.items = null;
                    }

                    $scope.oldQuery = angular.copy($scope.data.query);
                    console.log($scope.oldQuery);
                    $scope.loading = false;
                    $scope.searchDone = res.data.query && res.data.query.length;
                })
                .catch(function(err) {
                    console.error(err);
                    toastr.warning('Dang boss! Something went wrong...');
                    $scope.items = null;
                    $scope.oldQuery = angular.copy($scope.data.query);
                    $scope.loading = false;
                    $scope.searchDone = true;
                });
        }

        $scope.doSearch = function() {
            dbSearch();
        };

        // Load all contractors (paginated?)
        if ($scope.employer) {
            $scope.loading = true;
            doSearch();
        }

        $rootScope.$on('Posts:reload', function() {
            $scope.loading = true;
            getPosts();
        });

        function getPosts() {
            return $http.get('/api/posts/dashboard/includes=skills,user')
                .then(function(res) {
                    $timeout(function() {
                        $scope.items = _.sortBy(res.data.posts, '_createdDate').reverse();
                        $scope.loading = false;
                    }, 1000);
                })
                .catch(function(err) {
                    console.error(err);
                    toastr.warning('There was an error getting projects. Please try again');
                });
        }

    });
