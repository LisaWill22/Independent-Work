// All our custom angular filters used in the app live here

angular.module('appFilters', [])
    // Transforms a string to sentence case
    .filter('sentenceCase', function() {
        return _.memoize(function(x) {
            var capitalize, fmt;

            if (!angular.isString(x)) {
                return;
            }
            x = x.toLowerCase();
            capitalize = function(str) {
                str += '';
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            fmt = function(y) {
                var capitalized;

                return capitalized = capitalize($.trim(y));
            };
            x = _.map(x.split('.'), function(z) {
                return fmt(z);
            }).join('. ');
            x = _.map(x.split('!'), function(z) {
                return fmt(z);
            }).join('! ');
            return x = _.map(x.split(','), function(z) {
                return z;
            }).join(', ');
        });
    })
    // Used in the ui-select-match directive
    .filter('propsFilter', function() {
    	return function(items, props) {
    		var out = [];

    		if (angular.isArray(items)) {
    			items.forEach(function(item) {
    				var itemMatches = false;

    				var keys = Object.keys(props);
    				for (var i = 0; i < keys.length; i++) {
    					var prop = keys[i];
    					var text = props[prop].toLowerCase();
    					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
    						itemMatches = true;
    						break;
    					}
    				}

    				if (itemMatches) {
    					out.push(item);
    				}
    			});
    		} else {
    			// Let the output be the input untouched
    			out = items;
    		}

    		return out;
    	};
    })
    // Generic telephone filter to display non formatted telephones - 18778881234 -> 1-877-888-1234
    .filter('tel', function () {
        return function (tel) {
            if (!tel) {
                return '';
            }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var city, number;

            switch (value.length) {
                case 1:
                case 2:
                case 3:
                    city = value;
                    break;

                default:
                    city = value.slice(0, 3);
                    number = value.slice(3);
            }

            if (number) {
                if (number.length > 3) {
                    number = number.slice(0, 3) + '-' + number.slice(3, 7);
                } else {
                    number = number;
                }

                return ('(' + city + ') ' + number).trim();
            } else {
                return '(' + city;
            }

        };
    })
    .filter('removeUnderscores', function () {
        return function (input) {
            if (input) {
                return input.replace(/_/g, ' ');
            }
            return input;
        };
    })

    .filter('spacesToDashes', function () {
        return function (input) {
            if (input) {
                return input.replace(/ /g, '-').toLowerCase();
            }
            return input;
        };
    })
