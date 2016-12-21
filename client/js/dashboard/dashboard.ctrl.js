'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function($scope, $rootScope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        $rootScope.hideFooter = true;

        $scope.filtersCollapsed = true;
        $scope.data = {};
        $scope.data.query = '';

        // Load in postings
        if ($scope.contractor) {
            $scope.loading = true;
            getPosts();
        }

        $scope.doSearch = function() {
            $scope.loading = true;
            $http.get('/sapi/search/contractors?query=' + $scope.data.query)
                .then(function(res) {
                    console.log(res);
                    if (res.data.users && res.data.users.length) {
                        $scope.items = _.filter(res.data.users, function(user) {
                            return user.roles && user.roles.indexOf('contractor') !== -1;
                        });
                    } else {
                        $scope.items = null;
                    }
                    
                    $scope.loading = false;
                })
                .catch(function(err) {
                    console.log(err);
                    $scope.items = null;
                    toastr.warning('Dang boss! Something went wrong...');
                    $scope.loading = false;
                });
        };

        // Load all contractors (paginated?)
        if ($scope.employer) {
            $scope.loading = true;
            $scope.doSearch();
        }

        $rootScope.$on('Posts:reload', function() {
            $scope.loading = true;
            getPosts();
        });

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

    });
