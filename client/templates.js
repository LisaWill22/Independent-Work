angular.module('app.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('partials/_footer.html','<footer><div class=row><div class=text-center><ul class="list list-inline list-unstyled"><li><a href=# ui-sref=app.privacy><i class="fa fa-fw fa-lock"></i>Privacy Policy</a></li>|<li><a href=# ui-sref=app.support><i class="fa fa-fw fa-life-buoy"></i>Support</a></li></ul></div><div class="row text-center copyright"><small>&copy; 2016 - Independent Work</small></div></div></footer>');
$templateCache.put('partials/_header.html','<header><nav class="navbar navbar-default navbar-fixed-top" ng-class="{ \'slim\': slimHeader }" slim-header><div class=container><div class=navbar-header><a class=navbar-brand href=# ui-sref=app.home><img src=/images/logo_transparent_background.png title="independent - work"></a></div><div class="collapse navbar-collapse" id=bs-example-navbar-collapse-1><ul class="nav navbar-nav navbar-right"><li ng-show=!currentUser><a class="btn btn-primary btn-sm" href=# ui-sref=app.signup ui-sref-active=active ng-hide=hideSignup>Sign Up</a></li><li ng-show=!currentUser><a class="btn btn-link btn-sm" href=# ui-sref=app.auth.login ui-sref-active=active ng-hide=hideLogin>Log In</a></li><li class="dropdown dropdown-user-menu" ng-show=currentUser ng-click="userMenuOpen = !userMenuOpen"><a uib-popover-template="\'partials/_user-menu.html\'" popover-placement=bottom-right popover-trigger="\'outsideClick\'" popover-is-open=userMenuOpen class="btn btn-link dropdown-toggle"><i class="fa fa-lg fa-fw fa-user-circle"></i> <strong>{{ currentUser.firstName }}</strong> <i class="fa fa-fw fa-caret-down"></i></a></li></ul></div></div></nav></header>');
$templateCache.put('partials/_user-menu.html','<div class=user-menu><ul class="dropdown-menu-user list-unstyled"><li><div class=navbar-login><div class=row><div class=col-xs-12><strong class=pull-left>{{ currentUser.firstName}} {{currentUser.lastName}}</strong> <small class=pull-right>{{ currentUser.local.email}}</small></div></div><div class=notification-wrapper><i></i></div></div></li><li><ul class="list-group list-group-menu list-unstyled"><li class=list-group-item ng-show=contractor><button class="btn btn-primary btn-block btn-no-radius" ng-click="openCreatePostModal(); userMenuOpen = !userMenuOpen"><i class="fa fa-fw fa-plus-circle" aria-hidden=true></i> Create post</button></li><li class=list-group-item><a href=# ui-sref=app.dashboard ui-sref-active=active ng-click="userMenuOpen = !userMenuOpen">Dashboard</a></li><li class="list-group-item clearfix"><a href=# ui-sref=app.chat.list ui-sref-active=active ng-click="userMenuOpen = !userMenuOpen">Messages <span class="badge badge-primary pull-right">{{ currentUser.messages.new.length }}</span></a></li><li class=list-group-item><a href=# ui-sref=app.settings.profile ui-sref-active=active ng-click="userMenuOpen = !userMenuOpen">Settings</a></li></ul></li><li><div class="navbar-login navbar-login-session"><div class=row><div class=col-xs-12><p><a href=# ui-sref=app.auth.logout class="btn btn-sm btn-default pull-right" ng-click="userMenuOpen = !userMenuOpen">Log Out</a></p></div></div></div></li></ul></div>');
$templateCache.put('partials/layout.html','<div ng-include="\'partials/_header.html\'"></div><div ui-view=container></div><div ng-include="\'partials/_footer.html\'"></div>');
$templateCache.put('partials/spinner.html','<div class=spinner></div>');
$templateCache.put('chat/views/_send-message-popover.html','<div class=send-message-poopover><form action=index.html method=post><div class=form-group><label for=message>Your message:</label> <textarea ng-model=data.message class=form-control name=message rows=8 cols=40 placeholder="What would you like to say to {{ contractor.firstName}} ?"></textarea></div><button class="btn btn-primary btn-sm btn-block" type=button name=button ng-click=sendMessage(contractor)>Send Message</button></form></div>');
$templateCache.put('chat/views/chat-detail.html','<div class=panel ng-repeat="message in messages">{{ message.message }} {{ message.recipient.firstName }} {{ message.recipient.firstName }}</div>');
$templateCache.put('chat/views/chat-list.html','<div class=chat-list><div ng-show=loading class="text-center ng-show-fade"><h2 class=lead>Loading messages...</h2><spinner></spinner></div><div class=row ng-show=!loading><div class=col-sm-4><ul class=list-group><li class="list-group-item clearfix" ng-repeat="user in users"><a href=# ui-sref="app.chat.list.detail({ id: user._id })">{{ user.firstName }} {{ user.lastName}}</a></li></ul></div><div class=col-sm-8><div class=chat-container id=chat-container><div class="panel animate-fade-in" ng-repeat="message in messages"><div class=panel-body><h5 ng-class="{ \'text-primary\': message.sender._id === currentUser._id, \'text-info\': message.sender._id !== currentUser._id }">{{ message.sender.firstName }} {{ message.sender.lastName }} <small>{{ message._dateSent | date:\'short\'}}</small></h5>{{ message.message }}</div></div></div><textarea class="form-control chat-box" placeholder="Whatchu got to say?" rows=4 ng-model=data.message>\n            </textarea><button class="btn btn-primary btn-block btn-lg" type=button name=send ng-click=sendMessage() ng-enter=sendMessage()>SEND</button></div></div></div>');
$templateCache.put('chat/views/index.html','<div class=container><h1>Chat</h1><ui-view></ui-view></div>');
$templateCache.put('auth/views/forgot-password.html','<div class=container><div class=row><div class="col-xs-10 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4 col-xs-offset-2"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit><h3>Forgot your password?</h3><hr class=colorgraph><p>Enter the email address you used to sign up for Independent Work and we will email you instructions on how to reset your password.</p><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Your Email Address" tabindex=4></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-primary btn-block btn-lg" tabindex=7 ng-click=resetPassword()>Reset Password</div></div></div><div class=row><div class=col-xs-12><hr></div></div><div class=row><div class=col-xs-12><small>Back to <a href=# ui-sref=app.auth.login>Login</a></small></div></div></form></div></div></div></div></div>');
$templateCache.put('auth/views/index.html','<div class="section top-section login-page height-100"><div class=content-wrapper><div ui-view></div></div></div>');
$templateCache.put('auth/views/login.html','<div class=container><div class=row><div class="col-xs-12 col-sm-6 col-md-4 col-sm-offset-3 col-md-offset-4"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit ng-show=!currentUser><h3>Log In<h5>or <a href=# ui-sref=app.signup>create an account</a></h5></h3><hr class=colorgraph><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><div class=form-group><input ng-model=data.password type=password name=password id=password class="form-control input-lg" placeholder=Password tabindex=5></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-primary btn-block btn-lg" tabindex=7 ng-click=login()>Go to dashboard</div></div></div><hr><div class=text-center><small><a href=# ui-sref=app.auth.forgot-password>Forgot your password?</a></small></div></form><div class=text-center ng-show=currentUser>You are already logged in as {{ currentUser.local.email }}.<br><br><div class=text-center><a href=# class="btn btn-default" ui-sref=app.auth.logout>Log in as a different user</a></div></div></div></div></div></div></div>');
$templateCache.put('auth/views/logout.html','<h2 class="lead text-center">Logging you out...</h2><spinner></spinner>');
$templateCache.put('home/views/contact.html','<div class="section contact-section"><div class=container><div class="row top-area"><div class="col-md-6 left-area"><h2>GET IN TOUCH</h2><p>Want to support or just want to say hi? It\'s all good, we\'d love to connect with you.<br>Fill out the form below and we\'ll get back to you ASAP!</p><input type=text class=form-control placeholder="Your name" ng-model=data.name> <input type=text class=form-control placeholder="Email address" ng-model=data.email> <textarea class=form-control rows=5 placeholder="Your message" ng-model=data.message></textarea> <a class="btn btn-primary" ng-click=sendContactEmail()>Send Message</a></div><div class="col-md-6 right-area"><h2>OUR CONTACT</h2><div class=component><div class=right-symbol></div><div class=email><a href=mail:tolisa@independentwork.com>lisa@independentwork.com</a></div></div><div class=component><div class=right-symbol></div><div>5130 S Ft Apache Rd.<br>Ste. 215 #250<br>Las Vegas, NV 89148</div></div><div class=component><div class=right-symbol></div><div>1-877-874-4820</div></div></div></div></div></div>');
$templateCache.put('home/views/independent.html','<div class="section independent-section"><div class="left-area col-sm-6"></div><div class="right-area col-sm-6"><h2>Being Independent Should be Celebrated, Not Difficult</h2><p>Independent Work seeks to provide an interactive and dynamic community of independent workers (you) in an easily searchable format with an emphasis on autonomy and dignity for all. Get away from the terrible rating systems, high fees and lack of community on other sites and join us.</p><a class="btn learn-more">Learn More</a></div></div>');
$templateCache.put('home/views/index.html','<div class=home-page><section ui-view=top></section><section ui-view=mission></section><section ui-view=independent></section><section ui-view=new_way></section><section ui-view=join></section><section ui-view=contact></section></div>');
$templateCache.put('home/views/join.html','<div class="section join-section"><div class=mark><h1>Sign Up for Early Access</h1><h2>Get notified when we launch and change the way you work.</h2><br><br><div class=row><div class="col-xs-6 col-xs-offset-3 col-sm-4 col-sm-offset-4 col-lg-2 col-lg-offset-5"><a class="btn btn-primary btn-lg btn-block" ui-sref=app.signup>Join us for beta</a></div></div></div></div>');
$templateCache.put('home/views/mission.html','<div class="section mission-section"><div class=section-title><h1>An easier way to work</h1><h2>Our mission is to make it easier for you to find work, and for your customers to work with you</h2></div><div class=section-content><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>A Real Profile</h2><p>It\'s your career, not ours, so add or remove anything you want to help you get the job. No pre-defined fields or required entries.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>No Low-Ball Bidding</h2><p>Other job sites force you to compete for jobs by bidding, and the lowest usually wins. Not here. Your expertise is worth something more.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>No Crazy Rating System</h2><p>Everyone has had an unhappy customer, but that shouldn\'t effect your future earnings. Let customers leave meaningful reviews, not one stars.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>No Fees to Employers</h2><p>Did you see how high Upwork just jacked up their prices? Not cool. Independent Work charges no fees to employers, and the only fee you pay is $9/month.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>Negotiate On Your Terms</h2><p>We put the power into you and your customer\'s hands to negotiate terms that work for you. Want to get paid hourly? Weekly? By deliverable? Works for us.</p></div></div><div class="mission-block col-sm-4"><div class="left-symbol col-sm-2"></div><div class="block-content col-sm-10"><h2>Your Community</h2><p>Never feel alone again. Join our robust community of independent freelancers and contractors all in the same boat as you.</p></div></div></div></div>');
$templateCache.put('home/views/new_way.html','<div class="section new-way-section"><div class=section-title><h1>A New Way to Work</h1><h2>Ideal for freelancers, contractors, and their customers</h2></div><div class=section-content><div class="left-area col-sm-5"><h2>Independent Work is your pathway to a rewarding, hassle free and fulfilling independent career</h2><div class=block><div class=block-title><div class=block-symbol></div><h2>Amazingly Simple to Use</h2></div><p>With a minimalistic design, no fees and no contracts our platform is the first of it\'s kind making it very simple to find and secure work.</p></div><div class=block><div class=block-title><div class=block-symbol></div><h2>Power In Your Hands</h2></div><p>Our focus is on the worker, not the customer. This ensures customers find independent workers who are dedicated to their craft, love their work, and are looking for long lasting contractor relationships.</p></div></div><div class="right-area col-sm-7"><img src=/images/white_logo_color_background.png></div></div></div>');
$templateCache.put('home/views/top.html','<div class="section top-section"><div class=banner><div class=overlay></div><h1 class=text-white>Work Independently, Together</h1><br><h2 class=text-white>The best place for contractors & freelancers to find work, collaborate, and get paid.</h2><br><div class=row><div class="col-sm-8 col-sm-offset-2"><div class=input-group><input type=email id=s-email name=EMAIL placeholder="Enter your Email Address" class=form-control required><span class=input-group-btn><button class="btn btn-primary btn-lg">SIGNUP FOR BETA</button></span></div></div></div></div></div>');
$templateCache.put('contractors/views/_contractor-panel-small.html','<div class="panel panel-default panel-contractor"><div class=panel-body><div class=media><div class="media-left media-middle"><a href=# ui-sref="app.contractors.profile({ id: item._id })"><img class="media-object img img-circle img-thumbnail img-avatar" src=https://www.fmtv.com/static/img/pages/default-user-avatar.jpg alt=...></a></div><div class=media-body><h3 class=media-heading><a href=# ui-sref="app.contractors.profile({ id: item._id})">{{ item.firstName }} {{ item.lastName }}</a></h3><p><small class=block>{{ item.location.city }}, {{ item.location.state }}</small></p><p><span class="label label-primary" ng-repeat="skill in item.skills">{{ skill.name | sentenceCase }}</span></p><p></p></div></div></div><div class="absolute a-top a-right"><a href=# ui-sref="app.contractors.profile({ id: item._id })" class="btn btn-default btn-sm">View Profile</a></div></div>');
$templateCache.put('contractors/views/index.html','<div class=container><h2 ng-hide=hideTitle>Contractors</h2><ui-view></ui-view></div>');
$templateCache.put('contractors/views/profile.html','<div class=row><div class="col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4"><div class="panel panel-default"><div class="panel-body text-center"><img class="img img-circle img-thumbnail img-avatar" src=https://www.fmtv.com/static/img/pages/default-user-avatar.jpg alt=...><h2 class=lead>{{ contractor.firstName}} {{ contractor.lastName}}</h2><h3 ng-show="contractor.skills && contractor.skills.length"><span class="label label-primary" ng-repeat="skill in contractor.skills">{{ skill.name }}</span></h3><button uib-popover-template="\'chat/views/_send-message-popover.html\'" popover-placement=right popover-trigger="\'outsideClick\'" popover-title="{{ \'Send Message to \' + contractor.firstName}}" type=button class="btn btn-default">Message {{ contractor.firstName }}</button></div></div></div></div>');
$templateCache.put('posts/views/_post-form.html','<div class=form-posting><div class=form-group><div class=form-group><div class=row><div class=col-sm-8><label for=postingName>Title</label> <input ng-model=data.title type=text name=postingTitle id=postingTitle class=form-control placeholder="Some posting title"></div></div></div><div class=form-group><label for=postingDescription>Content</label> <textarea ng-model=data.content class=form-control name=postingDescription id=postingDescription rows=8 cols=40 placeholder="Explain a little bit about the posting."></textarea></div><div class=form-group><label for=skills>Related Skills</label><ui-select multiple=true search-enabled=true close-on-select=false ng-model=data.skills theme=bootstrap><ui-select-match placeholder="What skills does this posting require?">{{ $item.name }}</ui-select-match><ui-select-choices repeat="skill in skills track by skill.name | propsFilter: { name: $select.search }" group-by="\'category\'"><small>{{ skill.name }}</small></ui-select-choices></ui-select></div></div></div>');
$templateCache.put('posts/views/_post-head.html','<div class=post-head><div class=user-info></div><div class=post-info><p>{{ post.content }}</p></div></div>');
$templateCache.put('posts/views/_post-reply.html','');
$templateCache.put('posts/views/_post-snippet.html','<div class="panel panel-default panel-post"><div class=panel-body><div class=media><div class="media-left media-middle"><a href=# ui-sref="app.contractors({ id: item.user._id })"><img class="media-object img img-circle img-thumbnail img-avatar" src=https://www.fmtv.com/static/img/pages/default-user-avatar.jpg alt=...></a></div><div class=media-body><h3 class=media-heading><a href=# ui-sref="app.posts.detail({ id: item._id})">{{ item.title }}</a></h3><p><small class=block>Posted {{ item._createdDate | date: \'fullDate\'}} by <a href=# ui-sref="app.contractors.profile({ id: item.user._id })">{{ item.user.firstName }} {{ item.user.lastName }}</a></small> <small class=block ng-show=item.lastPost>Last post {{ item.lastPost.date | date: \'fullDate\'}} by <a href=# ui-sref="app.contractors.profile({ id: item.user._id })">{{ item.lastPost.user.firstName }} {{ item.lastPost.user.lastName }}</a></small></p><p><span class="label label-primary" ng-repeat="skill in item.skills">{{ skill.name | sentenceCase }}</span></p><p></p></div></div><div class=reply-wrapper><div class="label label-default text-uppercase text-secondary">{{ 13 }} replies</div></div></div></div>');
$templateCache.put('posts/views/create-post-modal.html','<div class=modal-header><h3 class=modal-title id=modal-title>Create a Community Post</h3></div><div class=modal-body><div ng-include="\'posts/views/_post-form.html\'"></div></div><div class=modal-footer><button class="btn btn-primary" type=button ng-click=createPost()>Publish Post</button> <button class="btn btn-link" type=button ng-click=cancel()>Cancel</button></div>');
$templateCache.put('posts/views/detail.html','<div ng-show=loading class="text-center ng-show-fade">Loading post<spinner></spinner></div><div class="row ng-show-fade" ng-show=!loading><div class="col-md-3 col-sm-4"><div class="panel panel-default"><div class=panel-heading><h4>Post Stats</h4></div><div class=panel-body><p>{{ post.replies.length }} replies</p><p>{{ post.contributors.length }} contributors</p><p>{{ \'23\' }} days active</p><h3 ng-show="post.skills && post.skills.length"><span class="label label-primary label-skill" ng-repeat="skill in post.skills">{{ skill.name }}</span></h3></div></div></div><div class="col-md-9 col-sm-8"><div class=row><div class=col-xs-12><div class="panel panel-default"><div class="panel-heading clearfix"><h3 class=pull-left>{{ post.title }}</h3><button class="pull-right btn btn-primary btn-sm"><i class="fa fa-fw fa-reply" aria-hidden=true></i> Reply</button></div><div class=panel-body><div ng-include="\'posts/views/_post-head.html\'"></div><div ng-repeat="reply in post.replies track by $index" ng-include="\'posts/views/_post-reply.html\'"></div></div></div></div></div></div></div>');
$templateCache.put('posts/views/index.html','<div class=container><ui-view></ui-view></div>');
$templateCache.put('dashboard/views/index.html','<div class="container app-container"><div ng-show=loading class="text-center ng-show-fade"><h2 class=lead>Loading dashboard...</h2><spinner></spinner></div><div class="row ng-show-fade" ng-show=!loading><div class="col-md-3 col-sm-4"><div class="panel panel-default"><div class=panel-body><div class=text-right ng-show=employer><h2 class=h4>Search again</h2><div class=form-group></div></div><div class=text-right ng-show=contractor><h2>Topics</h2><div class=form-group><input class=form-control type=text name=search ng-model=query placeholder=Keyword></div></div></div></div></div><div class="col-md-9 col-sm-8"><ui-view><div class="panel panel-default" ng-show=employer><div class=panel-body><div class=row><div class=col-xs-12><h2>Contractors</h2></div></div><div class=row ng-repeat="item in items" ng-show="items.length > 0"><div class=col-xs-12><div ng-include="\'contractors/views/_contractor-panel-small.html\'"></div></div></div></div></div><div class="panel panel-default" ng-show=contractor><div class=panel-body><div class=row><div class=col-xs-12><h2>Community</h2></div></div><div class=row ng-show="!items.length && !loading"><div class="col-xs-12 text-center"><br><br><p class="text-center lead">Looks like there are no posts! Why don\'t you create one?</p><button class="btn btn-primary btn-lg" ng-click=openCreatePostModal()>Create a post</button><br><br></div></div><div class=row ng-repeat="item in items" ng-show="items.length &&!loading"><div class=col-xs-12><div ng-include="\'posts/views/_post-snippet.html\'"></div></div></div></div><div class="absolute a-top a-right" ng-show=items.length><button class="btn btn-primary" ng-click=openCreatePostModal()><i class="fa fa-fw fa-plus"></i> Create post</button></div></div></ui-view></div></div></div>');
$templateCache.put('settings/views/_profile-form.html','<div class=form-profile><div class=form-group><div class=row><div class=col-sm-6><label for=firstName>First name</label> <input ng-model=data.firstName type=text name=firstName id=firstName class=form-control placeholder=John></div><div class=col-sm-6><label for=lastName>Last name</label> <input ng-model=data.lastName type=text name=lastName id=lastName class=form-control placeholder=Doe></div></div></div><div class=form-group ng-show=employer><div class=row><div class=col-sm-12><label for=firstName>Company Name</label> <input ng-model=data.companyName type=text name=companyName id=companyName class=form-control placeholder="ACME Corp."></div></div></div><div class=form-group><div class=row><div class=col-sm-5><label for=city>City</label> <input ng-model=data.location.city type=text name=city id=city class=form-control placeholder="ACME Corp."></div><div class=col-sm-3><label for=state>State</label><select class=form-control name=state ng-model=data.location.state></select></div><div class=col-sm-4><label for=zip>Zipcode</label> <input class=form-control type=number name=zip id=zip ng-model=data.location.zipcode></div></div></div><div class=form-group ng-show=contractor><label for=skills>Skills</label><ui-select multiple=true tagging=addSkill ng-model=data.skills on-remove=onSkillRemove($item) theme=bootstrap><ui-select-match>{{$item.name}}</ui-select-match><ui-select-choices repeat="skill in skills track by skill.name | propsFilter: { name: $select.search }" minimum-input-length=2 group-by="\'category\'"><small>{{skill.name}}</small></ui-select-choices></ui-select></div><div class=form-group><label for=bio>Bio</label> <textarea ng-model=data.bio class=form-control name=bio id=bio rows=8 cols=40 placeholder="Tell a little about yourself"></textarea></div></div>');
$templateCache.put('settings/views/account.html','<form><div class="panel panel-default"><div class=panel-heading><h3 class=h4>Account Information</h3></div><div class=panel-body><div class=row><div class="col-md-9 col-xs-12"><h1>FORM GOES HERE</h1></div></div></div><div class=panel-footer><div class="btn btn-primary btn-lg" type=submit>Save Settings</div></div></div></form>');
$templateCache.put('settings/views/index.html','<div class=container><div class=row><div class="col-md-3 col-sm-4"><div class="panel panel-default"><div class=panel-heading><h3 class=h4>Your settings</h3></div><ul class="list-group list-group-menu list-unstyled"><li class=list-group-item><a href=# ui-sref=app.settings.profile ui-sref-active=active>Profile</a></li><li class=list-group-item><a href=# ui-sref=app.settings.account ui-sref-active=active>Account</a></li><li class=list-group-item ng-show=contractor><a href=# ui-sref=app.settings.posts ui-sref-active=active>Posts</a></li><li class=list-group-item><a href=# ui-sref=app.settings.messaging ui-sref-active=active>Messaging</a></li></ul></div></div><div class="col-md-9 col-sm-8"><div class=ui-view-container><div ui-view class=animate-view></div></div></div></div></div>');
$templateCache.put('settings/views/messaging.html','<form><div class="panel panel-default"><div class=panel-heading><h3 class=h4>In-App Messaging</h3></div><div class=panel-body><div class=row><div class="col-md-9 col-xs-12"><h1>FORM GOES HERE</h1></div></div></div><div class=panel-footer><div class="btn btn-primary btn-lg" type=submit>Save Settings</div></div></div></form>');
$templateCache.put('settings/views/posts.html','<form><div class="panel panel-default"><div class=panel-heading><h3 class=h4>Community Posts</h3></div><div class=panel-body><div class=row><div class="col-md-9 col-xs-12"><h1>FORM GOES HERE</h1></div></div></div><div class=panel-footer><div class="btn btn-primary btn-lg" type=submit>Save Settings</div></div></div></form>');
$templateCache.put('settings/views/profile.html','<form><div class="panel panel-default"><div class=panel-heading><h3 class=h4>Public Profile</h3></div><div class=panel-body><div class=row><div class="col-md-9 col-xs-12"><div ng-include="\'settings/views/_profile-form.html\'"></div></div></div></div><div class=panel-footer><div class="btn btn-primary btn-lg" type=submit ng-click=saveProfile()>Save profile</div></div></div></form>');
$templateCache.put('signup/views/index.html','<div class="section top-section signup-page height-100"><div class=content-wrapper><div ui-view><div class=container><div class=row><div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><h1 class=text-center>I am a ...</h1><hr class=colorgraph><br><div class=row><div class=col-sm-6><a class="btn btn-default btn-lg btn-block" ui-sref=app.signup.employer>Employer</a></div><div class=col-sm-6><a class="btn btn-primary btn-lg btn-block" ui-sref=app.signup.contractor>Contractor</a></div></div><br><hr class=colorgraph></div></div></div></div></div></div></div></div>');
$templateCache.put('signup/views/signup-contractor.html','<div class=container><div class=row><div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit><h3>Sign Up<h5>as a contractor</h5></h3><hr class=colorgraph><div class=row><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.firstName type=text name=first_name id=first_name class="form-control input-lg" placeholder="First Name" tabindex=1></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.lastName type=text name=last_name id=last_name class="form-control input-lg" placeholder="Last Name" tabindex=2></div></div></div><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><div class=form-group><input ng-model=data.password type=password name=password id=password class="form-control input-lg" placeholder=Password tabindex=5></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-primary btn-block btn-lg" tabindex=7 ng-click=signup()>Create account</div></div></div><div class=row><div class=col-xs-12><hr></div></div><div class=row><div class="col-xs-12 text-center"><small>Already have an account? <a href=# ui-sref=app.auth.login>Log in</a></small></div></div></form></div></div></div></div></div>');
$templateCache.put('signup/views/signup-employer.html','<div class=container><div class=row><div class="col-xs-10 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3 col-xs-offset-1"><div class="panel panel-default"><div class=panel-body><form role=form type=nosubmit><h3>Employer Sign Up</h3><hr class=colorgraph><div class=row><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.firstName type=text name=first_name id=first_name class="form-control input-lg" placeholder="First Name" tabindex=1></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.lastName type=text name=last_name id=last_name class="form-control input-lg" placeholder="Last Name" tabindex=2></div></div></div><div class=form-group><input ng-model=data.email type=email name=email id=email class="form-control input-lg" placeholder="Email Address" tabindex=4></div><div class=row><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=data.password type=password name=password id=password class="form-control input-lg" placeholder=Password tabindex=5></div></div><div class="col-xs-12 col-sm-6 col-md-6"><div class=form-group><input ng-model=passwordConfirm type=password name=password_confirmation id=password_confirmation class="form-control input-lg" placeholder="Confirm Password" tabindex=6></div></div></div><hr class=colorgraph><div class=row><div class=col-xs-12><div class="btn btn-default btn-block btn-lg" tabindex=7 ng-click=signup()>Sign up as Employer</div></div></div><div class=row><div class=col-xs-12><hr></div></div><div class=row><div class="col-xs-12 text-center"><small>Already have an account? <a href=# ui-sref=app.auth.login>Log in</a></small></div></div></form></div></div></div></div></div>');}]);