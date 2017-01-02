(function(){
    angular.module("procrast").controller("HomeController",[
        '$scope','$http','$interval',function($scope,$http,$interval){
            if(localStorage['User-Data'] != undefined){
              $scope.user= JSON.parse(localStorage['User-Data']);
            //  console.log($scope.user);
            }

            $scope.postProst = function(event){
              if(event.which == 13){
                  var request = {
                     userinfo : $scope.user,
                     prostcontent : $scope.prost
                  }

                  $http.post('api/prost/post',request).then(function(res){
                      $scope.procrast = res;
                  }).catch(function(err){
                      console.log(err);
                  });
              }
            }


            // get prosts

            function getProst(initial){
               $http.get('api/prost/get').then(function(response){
                  if(initial){
                    $scope.shownewprost = false;
                    $scope.procrast = response;
                  }else{
                    if(response.data.length > $scope.procrast.data.length){
                      $scope.shownewprost = true;
                      $scope.newprocrast = response;
                    }else{
                      $scope.newprocrast = $scope.procrast;
                    }
                  }
               }).catch(function(error){
                  console.log(error);
               });
            }

            $scope.getIncomingProsts = function(){
                $scope.prosts = angular.copy($scope.newprocrast);
                $scope.newprocrast = undefined;
            };
            //initialisation of get
            // run interval function after every few seconds
            $interval(function () {
              getProst(false);
              // console.log($scope.procrast.data.length);
              // console.log($scope.newprocrast.data.length);
              if($scope.newprocrast){
                  $scope.difference = $scope.newprocrast.data.length - $scope.procrast.data.length;
              }
            }, 3000);

            getProst(true);
        }
    ]);
}());
