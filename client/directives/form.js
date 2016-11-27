angular.module('boForm', [
    'ngMessages',
    'ngSanitize'
])
    /**
    * @ngdoc directive
    * @name boForm.directive:boForm
    * @restrict 'A'
    * @element form
    * @description
    *
    * This is the main directive of the boForm module and it is implemented as an attribute on a form element.
    * Other attribute directives like `bo-validate`, the validation directive, can also be placed on the form element.
    *
    * @example
        <example module="boForm">
            <file name="bo-form-example.html">
                <div ng-controller="boFormDemoCtrl">
                    <form bo-form
                      autocomplete="off"
                      novalidate
                      name="signupForm"
                      class="embed landingform container-div"
                      ng-after-submit="afterSubmit"
                      ng-action="/authorize/signup">
                        <div class="form-error" ng-show="signupForm.$serverError" ng-cloak>
                            There was an error submitting the form. Please try again or <a
                                href="https://pokitdok.com/contact?context=Platform Signup Form Error">contact
                            us</a>.
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group" bo-validate>
                                    <label>First Name</label>
                                    <input type="text"
                                           name="first_name"
                                           ng-model="data.first_name"
                                           class="form-control"
                                           ng-required="true"/>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group" bo-validate>
                                    <label>Last Name</label>
                                    <input type="text"
                                           name="last_name"
                                           ng-model="data.last_name"
                                           class="form-control"
                                           ng-required="true"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group" bo-validate>
                                    <label>Email Address</label>
                                    <input type="email"
                                           name="email"
                                           ng-model="data.email"
                                           class="form-control"
                                           ng-required="true"
                                           bo-available="/email-available"/>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group" bo-validate>
                                    <label>Password</label>
                                    <input type="password"
                                           bo-password-rules
                                           name="password"
                                           ng-model="data.password"
                                           class="form-control"
                                           ng-required="true"/>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group" bo-validate>
                                    <label>Confirm Password</label>
                                    <input type="password"
                                           bo-password-match="password"
                                           name="confirm_password"
                                           ng-model="data.confirm_password"
                                           class="form-control"
                                           ng-required="true"/>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" bo-validate>
                            <p class="control-label"><br/>
                                <input type="checkbox" class="custom-checkbox"
                                       name="agree_tos" id="agree_tos"
                                       ng-model="data.agree_tos"
                                       ng-required="true"/>
                                <label class="custom-checkbox-label" for="agree_tos">
                                    I agree to <a class="link2" href="/terms" target="_blank">Terms</a>
                                    &amp;
                                    <a class="link2" href="/privacy" target="_blank">Privacy Policy</a></label>
                            </p>
                        </div>
                        <div class="form-actions text-center">
                            <br/>
                            <input type="hidden" ng-model="data.utm_source" name="utm_source"
                                   ng-init="data.utm_source='{{ session.utm_source }}'">
                            <input type="hidden" ng-model="data.utm_source" name="utm_source"
                                   ng-init="data.utm_keyword='{{ session.utm_keyword }}'">
                            <button type="submit"
                                    ng-disabled="signupForm.$submitting"
                                    class="btn btn-warning">
                                <i class="dark-loader-s"></i> SIGN UP
                            </button>
                        </div>
                    </form>
                </div>
            </file>
            <file name="boFormCtrl.js">
                angular.module('boForm')
                    .controller('boFormDemoCtrl', function($scope) {
                        $scope.afterSubmit = function () {
                            alert('afterSubmit fired');
                        };
                    });
            </file>
        </example>
    *
    */
    .directive('boForm', function ($http) {
        return {
            restrict: 'A',
            controller: function ($scope, $element, $attrs) {
                $element.bind('submit', function () {
                    var formCtrl = $scope[$attrs.name],
                        method = $attrs.method || 'POST';
                    method = method.toLowerCase();
                    formCtrl.$attempted = true;
                    if (formCtrl.$invalid) {
                        return false;
                    }
                    formCtrl.$serverError = false;
                    formCtrl.$serverSuccess = false;
                    formCtrl.$submitting = true;
                    function done() {
                        if ($attrs.noSubmit) {
                            formCtrl.$serverSuccess = true;
                            formCtrl.$submitting = false;
                            $attrs.ngAfterSubmit && $scope[$attrs.ngAfterSubmit]();
                            return true;
                        }
                        $http[method]($attrs.ngAction, $scope.data)
                            .then(function (res) {
                                formCtrl.$submitting = false;
                                formCtrl.$serverSuccess = true;
                                $attrs.ngAfterSubmit && $scope[$attrs.ngAfterSubmit](res);
                            }, function (res) {
                                console.error(res);
                                formCtrl.$submitting = false;
                                formCtrl.errors = res.errors;
                                formCtrl.$serverError = true;
                                $attrs.ngOnError && $scope[$attrs.ngOnError](res);
                            });
                    }

                    // If you need to do something async, add the done callback as an argument
                    // to your beforeSubmit function in your controller. You will need to
                    // return a truthy value from your beforeSubmit function and invoke your
                    // callback after your async action has complete, i.e. in inside a .then
                    // block
                    if ($attrs.ngBeforeSubmit) {
                        !$scope[$attrs.ngBeforeSubmit](done) && done();
                    } else {
                        done();
                    }

                });
            }
        };
    })

    /**
     * @ngdoc directive
     * @name boForm.directive:boValidate
     * @terminal
     * @restrict 'A'
     * @description
     *
     * boValidate is used to trigger validation on an input. It should be implemented as an attribute
     * on an input elements parent or container element. It takes no parameters, but instead handles
     * hiding and showing error messages found in
     *
     * `bo-assets/bo-form/default-errors-messages.html`:
     *
     * <pre>
         <span ng-message="required">This field is required.</span>
         <span ng-message="minlength">Your entry is too short</span>
         <span ng-message="maxlength">Your entry is too long</span>
         <span ng-message="email">A valid email address is required</span>
         <span ng-message="pattern">Invalid entry</span>
         <span ng-message="url">Invalid URL</span>
         <span ng-message="boAvailable">Value is not available for use</span>
         <span ng-message="boPasswordMatch">Passwords must match</span>
         <span ng-message="boPasswordRules">Invalid password</span>
         <span ng-message="boInsurance">You must fill both insurance fields</span>
     * </pre>
     *
     * The validation messsage it triggers is based on the type of validation attribute placed on field itself,
     * i.e, the input field that is a child of the element that has the `bo-validate` directive as an attribute.
     * Requires a `<form>` element as its parent.
     *
     */
    .directive('boValidate', function ($compile) {
        return {
            restrict: 'A',
            require: '^form',
            terminal: true,
            link: function (scope, element, attrs, fCtrl) {
                var attrName = fCtrl.$name + '.' + element.find('input,textarea,select,bo-select').attr('name'),
                    messages = element.find('[ng-message]').remove();

                if ( attrName.indexOf('undefined') > -1 ) {
                    attrName = fCtrl.$name + '.' + element.attr('field-name');
                }

                if ( _.has(attrs, 'showValidIcon') && attrs.boShowValidIcon !== 'false' ) {
                    element.css('position', 'relative');
                    element.append('<div class="input-valid-wrapper"><i class="fa fa-fw fa-check ng-show-fade" ng-show="' + attrName + '.$valid"></i></div>');
                }

                // if ( _.has(attrs, 'boShowValidIcon') && attrs.boShowInvalidIcon !== 'false' ) {
                //     element.css('position', 'relative');
                //     element.append('<div class="input-valid-wrapper"><i class="fa fa-fw fa-close ng-show-fade" ng-show="' + attrName + '.$invalid && ' + attrName + '.$dirty"></i></div>');
                // }

                element.removeAttr('bo-validate');
                element.attr('ng-class', '{\'has-error\':' + attrName + '.$invalid && (' + attrName + '.$touched || ' + fCtrl.$name + '.$attempted)}');
                element.append('<div class="help-block ng-show-fade" ng-messages="' + attrName + '.$error">' +
                    '<small ng-messages-include="directives/templates/default-error-messages.html"></small>' +
                    '</div>');
                element.find('.help-block').append(messages);
                $compile(element)(scope);
            }
        };
    })

    /**
     * @ngdoc directive
     * @name boForm.directive:boAvailable
     * @restrict 'A'
     * @element input
     * @description
     *
     * boAvailable is used to check whether a username/email is available for registration. This directive is
     * implemented as an attribute on an input field, most likely `<input type="email">`, though it will work
     * on any type of element or input type. Checks against our API/database to see if there's a user in our system
     * with that email already registered and displays a ng-message based on the result of the post to the db.
     * Requires the field to have an `ng-model`.
     *
     * @param {string} bo-available Should be a relative URL that points to something like `/accounts/email-available` or another API endpoint.
     *
     */
    .directive('boAvailable', function ($http, $q, $timeout, $compile) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel, fCtrl) {
                var url = attrs.boAvailable,
                    currentValue = false,
                    loadingName = attrs.name + '_loading',
                    aborter = $q.defer(),
                    req = null,
                    reverse = _.has(attrs, 'reverse'),
                    xEl = angular.element('<div class="input-valid-wrapper"><i class="fa fa-fw fa-close"></i></div>'),
                    checkEl = angular.element('<div class="input-valid-wrapper"><i class="fa fa-fw fa-check"></i></div>'),
                    spinnerEl = angular.element('<div class="spinner"></div>');

                var EMAIL_REGEXP = /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i;

                $timeout(function () {
                    currentValue = ngModel.$modelValue;
                }, 0);

                var checkAvailable = function (value) {
                    ngModel.$setValidity('availableEmail', true);
                    ngModel.$setValidity('available', true);
                    ngModel.$setValidity('required', false);

                    if ( reverse ) {
                        ngModel.$setValidity('emailNotFound', true);
                    }

                    if (req) {
                        aborter.resolve();
                        aborter = $q.defer();
                    }
                    if ( currentValue === value || currentValue === false) {
                        return value;
                    }

                    ngModel.$setTouched(true);
                    scope[loadingName] = true;
                    var reqData = {};
                    reqData[attrs.name] = value;
                    if ( EMAIL_REGEXP.test(reqData.email) ) {
                        checkEl.detach();
                        xEl.detach();
                        element.parent().append(spinnerEl);
                        $http.post(url, reqData, {timeout: aborter.promise})
                            .success(function (res) {
                                spinnerEl.detach();
                                scope[loadingName] = false;
                                if ( res.data.available || ( res.data.data && res.data.data.available ) ) {
                                    ngModel.$setValidity('availableLoading', true);
                                    element.css('position', 'relative');
                                    if ( reverse ) {
                                        element.parent().append(xEl);
                                        ngModel.$setValidity('emailNotFound', false);
                                    } else {
                                        element.parent().append(checkEl);
                                    }
                                } else {
                                    if ( reverse ) {
                                        element.parent().append(checkEl);
                                    } else {
                                        element.parent().append(xEl);
                                        ngModel.$setValidity('availableEmail', false);
                                    }
                                }
                            });
                        return value;
                    } else {
                        checkEl.detach();
                        element.parent().append(xEl);
                    }

                };
                ngModel.$parsers.push(checkAvailable);
                ngModel.$formatters.push(checkAvailable);
            }
        };
    })

    /**
    * @ngdoc directive
    * @name boForm.directive:input
    * @restrict 'E'
    * @element input
    * @priority 1
    * @description
    *
    * This directive overwrites Angular's built-in input validators and sets up new Regex patterns
    * for URLs and Email fields. These validations are automatically triggered if the `<input>` has a
    * type attribute of `url` or `email`. Requires the field to have an `ng-model`.
    *
    */
    .directive('input', function () {
        var URL_REGEXP = /^(?:[a-z0-9\.\-]*):\/\/(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[?[A-F0-9]*:[A-F0-9:]+\]?)(?::\d+)?(?:\/?|[\/?]\S+)$/i;
        var EMAIL_REGEXP = /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i;
        return {
            require: '?ngModel',
            restrict: 'E',
            priority: 1,
            link: function (scope, element, attrs, ngModel) {
                if (ngModel && attrs.type && attrs.type === 'url') {
                    ngModel.$validators.url = function (modelValue, viewValue) {
                        var value = modelValue || viewValue;
                        return (ngModel.$isEmpty(value) || URL_REGEXP.test(value));
                    };
                } else if (ngModel && attrs.type && attrs.type === 'email') {
                    ngModel.$validators.email = function (modelValue, viewValue) {
                        var value = modelValue || viewValue;
                        return (ngModel.$isEmpty(value) || EMAIL_REGEXP.test(value));
                    };
                }
            }
        };
    })

    /**
    * @ngdoc directive
    * @name boForm.directive:boPasswordRules
    * @restrict 'A'
    * @element input
    * @description
    *
    * The `bo-password-rules` directive checks the users password against the following rules during registration:
    *
    *   * must be between 8-128 characters
    *   * must contain 1 uppercase character, 1 lowercase character, 1 number, and 1 symbol or special character
    *
    * The directive also displays an error message that checks upon focus, blur, and change whether or not the password
    * has met the above rules. Should be placed on an `<input type="password">`. Requires the `<input>` field to have an `ng-model`.
    */
     .directive('boPasswordRules', function($compile) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function(scope, element, attrs, ngModel) {
                var rulesMarkup =   '<div class="password-rules-container">' +
                                        '<div ng-show="valid != true && valid != undefined" class="password-rules ng-show-fade">' +
                                            '<span>8 or more characters, must contain one of each of the following</span>' +
                                            '<ul>' +
                                                '<li>Uppercase Letter <i ng-show="hasUppercase" class="fa fa-fw fa-check text-success ng-show-fade"></i></li>' +
                                                '<li>Lowercase Letter <i ng-show="hasLowercase" class="fa fa-fw fa-check text-success ng-show-fade"></i></li>' +
                                                '<li>Number <i ng-show="hasNumber" class="fa fa-fw fa-check text-success ng-show-fade"></i></li>' +
                                                '<li>Symbol <i ng-show="hasSymbol" class="fa fa-fw fa-check text-success ng-show-fade"></i></li>' +
                                            '</ul>' +
                                        '</div>' +
                                    '</div>';
                var rules = angular.element(rulesMarkup);
                element.after(rules);
                $compile(rules)(scope);

                var validRe = /^(?=.{8,128}$)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z\d\s:])/;

                scope.hasNumber = false;
                scope.hasUppercase = false;
                scope.hasLowercase = false;
                scope.hasSymbol = false;

                function hasUppercase (value) {
                    var upperCase = /[A-Z]/;
                    return upperCase.test(value);
                }

                function hasLowercase (value) {
                    var lowerCase = /[a-z]/;
                    return lowerCase.test(value);
                }

                function hasNumber (value) {
                    var hasNum = /\d/;
                    return hasNum.test(value);
                }

                function hasSymbol (value) {
                    var hasSymbol = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/;
                    return hasSymbol.test(value);
                }

                function setValidityUI (value) {
                    scope.hasNumber = hasNumber(value);
                    scope.hasUppercase = hasUppercase(value);
                    scope.hasLowercase = hasLowercase(value);
                    scope.hasSymbol = hasSymbol(value);
                }

                element.on('focus', function() {
                    if ( scope.valid === undefined ) {
                        scope.valid = false;
                        scope.$digest();
                    }
                });

                element.on('blur', function() {
                    if ( !scope.valid ) {
                        scope.valid = undefined;
                        scope.$digest();
                    }
                });

                ngModel.$parsers.push(function (value) {
                    scope.valid = validRe.test(value);
                    ngModel.$setValidity('boPasswordRules', scope.valid);
                    setValidityUI(value);
                    return value;
                });
            }
        };
     })

     /**
     * @ngdoc directive
     * @name boForm.directive:boPasswordMatch
     * @scope
     * @restrict 'A'
     * @element input
     * @description
     *
     * The `bo-password-rules` directive checks the users password against another password field to verify
     * that they contain the same password. Should be placed on an `<input type="password">`.
     * Requires a `<form>` element as a parent.
     *
     * @param {string} bo-password-match Should contain a string that references the input `name` attribute of the
     *                                   password field you are trying to check for a match.
     *
     */
    .directive('boPasswordMatch', function () {
        return {
            require: '^form',
            restrict: 'A',
            link: function (scope, element, attrs, fCtrl) {
                var passwordField = fCtrl[attrs.boPasswordMatch],
                    confirmField = fCtrl[attrs.name];

                function setMatchValidity(value) {
                    if (value !== passwordField.$modelValue) {
                        confirmField.$setValidity('boPasswordMatch', false);
                    } else {
                        confirmField.$setValidity('boPasswordMatch', true);
                    }
                }

                passwordField.$viewChangeListeners.push(function () {
                    setMatchValidity(confirmField.$modelValue);
                });

                confirmField.$parsers.push(function (value) {
                    setMatchValidity(value);
                    return value;
                });
            }
        };
    })
    // Takes a form submit button and drops a spinner on it while the form is submitting
    .directive('boSubmitButton', function ($timeout) {
        return {
            require: '^form',
            restrict: 'AE',
            replace: true,
            link: function(scope, el, attrs, fCtrl) {
                var spinnerMarkup = '<div class="spinner"></div>',
                    spinnerEl = angular.element(spinnerMarkup),
                    text = el.context.innerHTML,
                    buttonHeight, buttonWidth,
                    hasAction;

                // check to see if formHasAction is present - prevents spinner from stopping
                // if form has an action that takes it to another state
                if ( attrs.hasOwnProperty('formHasAction') ) {
                    hasAction = true;
                } else {
                    hasAction = false;
                    // only hide when there is a serverSuccess
                    scope.$watch(fCtrl.$name + '.$serverSuccess', function(newVal) {
                        $timeout(function(){
                            if ( newVal ) {
                                hideSpinner();
                            }
                        }, 500);
                    });
                }

                el.parent().addClass('spinner-button');

                // watch the form for a submission
                scope.$watch(fCtrl.$name + '.$submitting', function(newVal) {
                    if ( newVal ) {
                        // if submitting is set to true, then show spinner
                        showSpinner();
                    } else if ( !newVal && !hasAction ){
                        // if submitting is set to false, stop showing.
                        // if form-has-action present, then leave spinning since page
                        // hideSpinner();
                    }
                });

                // only hide when there is a serverError
                scope.$watch(fCtrl.$name + '.$serverError', function(newVal) {
                    $timeout(function(){
                        if ( newVal ) {
                            hideSpinner();
                        }
                    }, 100);
                });

                function showSpinner() {
                    buttonHeight = el[0].offsetHeight;
                    buttonWidth = el[0].offsetWidth;
                    el.css('width', buttonWidth);
                    el.css('height', buttonHeight);
                    el.text('');
                    el.attr('disabled', true);
                    el.append(spinnerEl);
                }

                function hideSpinner() {
                    $timeout(function() {
                        el.text(text);
                        el.attr('disabled', false);
                        el.removeAttr('style');
                        spinnerEl.detach();
                    }, 250);
                }
            }
        };
    })
