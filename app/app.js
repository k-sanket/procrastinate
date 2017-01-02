(function(){

    // Assigning routes
    var application = angular.module("procrast",['ui.router','ngFileUpload'])
                              .config(function($stateProvider,$urlRouterProvider){

                                $urlRouterProvider.otherwise = '/';
                                $stateProvider.state('signUp',{
                                    url : "/signup",
                                    templateUrl : "app/signup/signup.html",
                                    controller : "SignupController"
                                })
                                .state('editProfile',{
                                    url : "/my-profile",
                                    templateUrl : "app/profile/my-profile.html",
                                    controller : "ProfileController"
                                })
                                .state('home',{
                                    url : "/",
                                    templateUrl : "app/home/home.html",
                                    controller : "HomeController"
                                })
                              })
}());
