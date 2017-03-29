'use strict';

angular.module('dashboard')
    .controller('DashboardCtrl', function(skills, $scope, $rootScope, $http, $timeout, toastr) {
        console.log('DashboardCtrl loaded >>', $scope);

        $rootScope.hideFooter = true;
        $scope.searchDone = false;
        $scope.filtersCollapsed = true;

        $scope.data = {};
        $scope.data.query = '';
        $scope.skills = skills.data;
        $scope.data.skillsMatch = 'any';

        // Load in postings
        if ($scope.contractor) {
            $scope.loading = true;
            getPosts();
        }

        // Load all contractors (paginated?)
        if ($scope.employer) {
            $scope.loading = true;
            doSearch();
        }

        // throttle the search to prevent duplications
        var dbSearch = _.throttle(doSearch);

        $rootScope.$on('Posts:reload', function() {
            $scope.loading = true;
            getPosts();
        });

        // Adds back skill to list of options on removal
        $scope.onSkillRemove = function(item, model) {
            if ($scope.skills.indexOf(item) === -1) {
                $scope.skills.push(item);
            }
        };

        $scope.doSearch = function() {
            dbSearch();
        };

        function doSearch () {
            $scope.loading = true;
            $scope.searchDone = false;
            $scope.data.skillsToFilterBy = null;
            var formattedQuery = $scope.data.query;
            console.log(formattedQuery)
            $http.get('/sapi/search/contractors?query=' + formattedQuery)
                .then(function(res) {
                    if (res.data.users && res.data.users.length) {
                        $scope.items = _.filter(res.data.users, function(user) {
                          console.log(user);
                            return user.roles && user.roles.indexOf('contractor') !== -1 && user.firstName;
                        });
                    } else {
                        console.log('no items', res);
                        $scope.items = null;
                    }

                    $scope.oldQuery = angular.copy($scope.data.query);
                    $scope.loading = false;
                    $scope.searchDone = true;
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

        function getPosts() {
            return $http.get('/api/posts/dashboard/includes=skills,user')
                .then(function(res) {
                    console.log("look",res);
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
