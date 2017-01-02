(function(){
  var app = angular.module('procrast')
.controller('NavigationController',['$scope','$state','$http','$window',function($scope,$state,$http,$window){
    if(localStorage['User-Data']){
        $scope.loggedIn =true;
    }else{
        $scope.loggedIn =false;
    }

    // console.log("reached hre");
   $scope.logUserIn =  function(){
     // check login authentication

    $http.post('api/user/login',$scope.login).then(function(response){
        // console.log("inside login");
        // console.log(response);
        localStorage.setItem('User-Data',JSON.stringify(response));
        $scope.loggedIn=true;
     }).catch(function(error){
        console.log(error);
     });
   };


   // logout function
   $scope.logOut = function(){
     localStorage.clear();
     $scope.loggedIn = false;
     //$window.location.href = '/';
   };
}]);
}());
