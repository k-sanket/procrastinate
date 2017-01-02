(function(){
  angular.module('procrast').controller("ProfileController",['$scope','Upload','$state','$http',function($scope,Upload,$state,$http){

      //console.log(localStorage['User-Data']);
      $scope.user = JSON.parse(localStorage['User-Data']) || undefined;
      // console.log($scope.user.data._id);
      $scope.$watch(function(){
          return $scope.file;
      },function(){
         $scope.upload($scope.file);
      })

      // var data =


      $scope.upload = function(file){
        if(file){
          Upload.upload({
            url : 'api/profile/editPhoto',
            method : 'POST',
            data : {userid : $scope.user.data._id,file:file},
          }).then(function(resp){
              console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
          },function(resp){
              console.log('Error status: ' + resp.status);
          },function(evt){
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
          });
        }
      };

      $scope.updateUserName = function(){
          var request = {
              userId : $scope.user.data._id,
              userName : $scope.user.username
          };

          $http.post('api/profile/updateUserName',request).then(function(response){
              console.log(response);
              $scope.usernamedata = $scope.user.username;
          }).catch(function(error){
              console.log(error);
          });
      };



     $scope.updateBioInformation = function(){
       var request = {
          userId : $scope.user.data._id,
          userBio : $scope.user.bio
       };

       $http.post('api/profile/updatebio',request).then(function(res){
         console.log("success");
         $scope.userbiodata = $scope.user.bio;
       }).catch(function(err){

         console.log("error");
       });
     };
  }]);
}());
