angular.module('app.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('partials/layout.html','<nav class="navbar navbar-default navbar-fixed-top" ng-class="{ \'slim\': slimHeader }" slim-header><div class=container><div class=navbar-header><a class=navbar-brand href=# ui-sref=app.home><img src=/images/logo_transparent_background.png title="independent - work"></a></div><div class="collapse navbar-collapse" id=bs-example-navbar-collapse-1><ul class="nav navbar-nav navbar-right"><li ng-show=!currentUser><a class="btn btn-primary" href=# ui-sref=app.signup ui-sref-active=active ng-hide=hideSignup>Sign Up</a></li><li ng-show=!currentUser><a class="btn btn-link btn-border" href=# ui-sref=app.auth.login ui-sref-active=active ng-hide=hideLogin>Log In</a></li><li ng-show=currentUser><a class="btn btn-link btn-border" href=# ui-sref=app.auth.logout ng-hide=hideLogout>Log Out</a></li></ul></div></div></nav><div ui-view=container class="height-100 app-container"></div>');
$templateCache.put('partials/spinner.html','<div class=spinner></div>');
$templateCache.put('auth/views/forgot-password.html','<div class=container><div class=row><div class="col-xs-12 col-sm-6 col-md-6 col-sm-offset-3 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit><h3>Forgot your password?</h3><hr class=colorgraph><p>Enter the email address you used to sign up for Independent Work and we will email you instructions on how to reset your password.</p><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-primary btn-block btn-lg" tabindex=7 ng-click=resetPassword()>Reset Password</div></div></div><div class=row><div class=col-xs-12><hr></div></div><div class=row><div class=col-xs-12><small><i class="fa fa-long-arrow-left"></i> Back to <a href=# ui-sref=app.auth.login>Login</a></small></div></div></form></div></div></div></div></div>');
$templateCache.put('auth/views/index.html','<div class="section top-section login-page height-100"><div class=content-wrapper><div ui-view></div></div></div>');
$templateCache.put('auth/views/login.html','<div class=container><div class=row><div class="col-xs-12 col-sm-6 col-md-6 col-sm-offset-3 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit ng-show=!currentUser><h3>Log In<h5>or <a href=# ui-sref=app.signup>or create account</a></h5></h3><hr class=colorgraph><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><div class=form-group><input ng-model=data.password type=password name=password id=password class="form-control input-lg" placeholder=Password tabindex=5></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-primary btn-block btn-lg" tabindex=7 ng-click=login()>Log In to IW</div></div></div><hr><div class=text-center><small><a href=# ui-sref=app.auth.forgot-password>Forgot your password?</a></small></div></form><div class=text-center ng-show=currentUser>You are already logged in as {{ currentUser.local.email }}.<br><br><div class=text-center><a href=# class="btn btn-default" ui-sref=app.auth.logout>Log in as different user</a></div></div></div></div></div></div></div>');
$templateCache.put('auth/views/logout.html','<h1 class=text-center>Logging you out...</h1><br><spinner></spinner>');
$templateCache.put('dashboard/views/index.html','<div class=container><h1>DASHBOARD</h1>{{ currentUser | json }}</div>');
$templateCache.put('home/views/contact.html','<div class="section contact-section"><div class=top-area><div class=left-area><h2>GET IN TOUCH</h2><p>Want to support or just want to say hi? It\'s all good, we\'d love to connect with you.<br>Fill out the form below and we\'ll get back to you ASAP!</p><input type=text class=form-control placeholder="Your name"> <input type=text class=form-control placeholder="Email address"> <textarea class=form-control rows=5 placeholder="Your message"></textarea> <a class="btn contact-send">Send Message</a></div><div class=right-area><h2>OUR CONTACT</h2><div class=component><div class=right-symbol></div><div class=email>lisa@independentwork.com</div></div><div class=component><div class=right-symbol></div><div>5130 S Ft Apache Rd.<br>Ste. 215 #250<br>Las Vegas, NV 89148</div></div><div class=component><div class=right-symbol></div><div>1-877-874-4820</div></div></div></div><div class=footer><div class=row><div class=text-center><span>Terms</span> <span>Privacy</span></div><div class="row text-center copyright">&copy; 2016 - Independent Work</div></div></div></div>');
$templateCache.put('home/views/independent.html','<div class="section independent-section"><div class="left-area col-sm-6"></div><div class="right-area col-sm-6"><h2>Being Independent Should be Celebrated, Not Difficult</h2><p>Independent Work seeks to provide an interactive and dynamic community of independent workers (you) in an easily searchable format with an emphasis on autonomy and dignity for all. Get away from the terrible rating systems, high fees and lack of community on other sites and join us.</p><a class="btn learn-more">Learn More</a></div></div>');
$templateCache.put('home/views/index.html','<div class=home-page><section ui-view=top></section><section ui-view=mission></section><section ui-view=independent></section><section ui-view=new_way></section><section ui-view=join></section><section ui-view=contact></section></div>');
$templateCache.put('home/views/join.html','<div class="section join-section"><div class=mark><h1>Sign Up for an Account</h1><h2>Get notified when we launch and change the way you work.</h2><div class=row><div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-lg-2 col-lg-offset-5"><a class="btn btn-primary btn-lg btn-block" ui-sref=app.signup>Sign Up</a></div></div></div></div>');
$templateCache.put('home/views/mission.html','<div class="section mission-section"><div class=section-title><h1>An easier way to work</h1><h2>Our mission is to make it easier for you to find work, and for your customers to work with you</h2></div><div class=section-content><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>A Real Profile</h2><p>It\'s your career, not ours, so add or remove anything you want to help you get the job. No pre-defined fields or required entries.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>No Low-Ball Bidding</h2><p>Other job sites force you to compete for jobs by bidding, and the lowest usually wins. Not here. Your expertise is worth something more.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>No Crazy Rating System</h2><p>Everyone has had an unhappy customer, but that shouldn\'t effect your future earnings. Let customers leave meaningful reviews, not one stars.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>No Fees to Employers</h2><p>Did you see how high Upwork just jacked up their prices? Not cool. Independent Work charges no fees to employers, and the only fee you pay is $9/month.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>Negotiate On Your Terms</h2><p>We put the power into you and your customer\'s hands to negotiate terms that work for you. Want to get paid hourly? Weekly? By deliverable? Works for us.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>Your Community</h2><p>Never feel alone again. Join our robust community of independent freelancers and contractors all in the same boat as you.</p></div></div></div></div>');
$templateCache.put('home/views/new_way.html','<div class="section new-way-section"><div class=section-title><h1>A New Way to Work</h1><h2>Ideal for freelancers, contractors, and their customers</h2></div><div class=section-content><div class="left-area col-sm-5"><h2>Independent Work is your pathway to a rewarding, hassle free and fulfilling independent career</h2><div class=block><div class=block-title><div class=block-symbol></div><h2>Amazingly Simple to Use</h2></div><p>With a minimalistic design, no fees and no contracts our platform is the first of it\'s kind making it very simple to find and secure work.</p></div><div class=block><div class=block-title><div class=block-symbol></div><h2>Power In Your Hands</h2></div><p>Our focus is on the worker, not the customer. This ensures customers find independent workers who are dedicated to their craft, love their work, and are looking for long lasting contractor relationships.</p></div></div><div class="right-area col-sm-7"><img src=/assets/images/white_logo_color_background.png></div></div></div>');
$templateCache.put('home/views/top.html','<div class="section top-section"><div class=banner><h1 class=text-white>Work Independently, Together</h1><br><h2 class=text-white>The best place for contractors & freelancers to find work, collaborate, and get paid.</h2><br><div class=row><div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-lg-2 col-lg-offset-5"><a class="btn btn-primary btn-lg btn-block" ui-sref=app.signup>Create your account</a></div></div></div></div>');
$templateCache.put('settings/views/index.html','');
$templateCache.put('settings/views/profile.html','');
$templateCache.put('signup/views/index.html','<div class="section top-section signup-page height-100"><div class=content-wrapper><div ui-view><div class=container><div class=row><div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><h1 class=text-center>I am a ...</h1><hr class=colorgraph><br><div class=row><div class=col-sm-6><a class="btn btn-default btn-lg btn-block" ui-sref=app.signup.employer>Employer</a></div><div class=col-sm-6><a class="btn btn-primary btn-lg btn-block" ui-sref=app.signup.contractor>Contractor</a></div></div><br><hr class=colorgraph></div></div></div></div></div></div></div></div>');
$templateCache.put('signup/views/signup-contractor.html','<div class=container><div class=row><div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit><h3>Sign Up<h5>as a contractor</h5></h3><hr class=colorgraph><div class=row><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.firstName type=text name=first_name id=first_name class="form-control input-lg" placeholder="First Name" tabindex=1></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.lastName type=text name=last_name id=last_name class="form-control input-lg" placeholder="Last Name" tabindex=2></div></div></div><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><div class=form-group><input ng-model=data.password type=password name=password id=password class="form-control input-lg" placeholder=Password tabindex=5></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-primary btn-block btn-lg" tabindex=7 ng-click=signup()>Create account</div></div></div><div class=row><div class=col-xs-12><hr></div></div><div class=row><div class="col-xs-12 text-center"><small>Already have an account? <a href=# ui-sref=app.auth.login>Login</a></small></div></div></form></div></div></div></div></div>');
$templateCache.put('signup/views/signup-employer.html','<div class=container><div class=row><div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit><h3>Employer Sign Up</h3><hr class=colorgraph><div class=row><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.firstName type=text name=first_name id=first_name class="form-control input-lg" placeholder="First Name" tabindex=1></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.lastName type=text name=last_name id=last_name class="form-control input-lg" placeholder="Last Name" tabindex=2></div></div></div><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><div class=row><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.password type=password name=password id=password class="form-control input-lg" placeholder=Password tabindex=5></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=passwordConfirm type=password name=password_confirmation id=password_confirmation class="form-control input-lg" placeholder="Confirm Password" tabindex=6></div></div></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-default btn-block btn-lg" tabindex=7 ng-click=signup()>Sign up as Employer</div></div></div><div class=row><div class=col-xs-12><hr></div></div><div class=row><div class="col-xs-12 text-center"><small>Already have an account? <a href=# ui-sref=app.auth.login>Login</a></small></div></div></form></div></div></div></div></div>');}]);