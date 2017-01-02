(function(){
  // testing grunt
  angular.module('procrast').controller('SignupController',['$scope','$state','$http',function($scope,$state,$http){
      $scope.createUser = function(){   
        $http.post('api/user/signup',$scope.newUser).then(function(response){
          console.log(response);
        }).catch(function(error){
          console.log(error);
        })
      };
  }]);
}());
