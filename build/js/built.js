(function(){
    // Setting up routes
    var application = angular.module("procrast",['ui.router','ngFileUpload'])
                              .config(function($stateProvider,$urlRouterProvider){

                                // if any other url visited , redirect to home
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
;(function(){
    angular.module("procrast").controller("HomeController",[
        '$scope','$http','$interval',function($scope,$http,$interval){
            if(localStorage['User-Data'] != undefined){
              $scope.user= JSON.parse(localStorage['User-Data']);
            //  console.log($scope.user);
            }


            // On pressing enter key posting tweets
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

                    // if tweets are posted while you are reading , show x tweets posted with a link
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
;(function(){
  angular.module('procrast').controller("ProfileController",['$scope','Upload','$state','$http',function($scope,Upload,$state,$http){

      //console.log(localStorage['User-Data']);
      $scope.user = JSON.parse(localStorage['User-Data']) || undefined;
      // console.log($scope.user.data._id);
      $scope.$watch(function(){
          return $scope.file;
      },function(){
         $scope.upload($scope.file);
      })

      // Upload function to uplaod image for a user


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
      // Update user name when user enters his name

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

      // Update user bio information

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
;(function(){
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
;(function(){
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
;var mongoose = require("mongoose");
var User =  require('../datasets/users');

module.exports.signup =  function(req,res){
   var user =  new User(req.body);
   user.save();
   res.json(req.body);
}

module.exports.login =  function(req,res){
   User.find(req.body,function(error,results){
     if(error){
       console.log(error);
     }

     if(results && results.length === 1){
       var userData = results[0];
       res.json({email:req.body.email,_id:userData._id,displayName:userData.username,imagePathD:userData.imagePath});
     }
   });
}
;var User =  require('../datasets/users');
var fs = require('fs-extra');
var path =  require('path');


module.exports.updatePhoto = function(req,res){
    var file = req.files.file;
    var userId = req.body.userid;
    var tempPath = file.path;
    // console.log(__dirname);
    // var uploadDate = new Date().toISOString;
    var targetPath = path.join(__dirname+'../../../uploads/'+ userId);
    console.log(tempPath);
    console.log(targetPath);

    fs.rename(tempPath,targetPath,function(err){
        if(err){
          console.log(err);
        }else{
          User.findByIdAndUpdate({_id:userId},{imagePath:targetPath},{upsert:true},function(err,response){
              if(err){
                  console.log(err);
                  res.json({status:500});
              }else{4
                  //console.log(response);
                  res.json({status:200});
              }
          });
        }

    });
};


module.exports.updateUserName = function(req){
  //console.log(req.body);
  User.findByIdAndUpdate({_id:req.body.userId},{username:req.body.userName},{upsert:true},function(err,res){
     if(err){
       res.json(err);
     }else{
       console.log(res.toObject());
     }
  });
};



module.exports.updateBio = function(req){
  console.log(req.body);
  User.findByIdAndUpdate({_id:req.body.userId},{userbio:req.body.userBio},{upsert:true},function(err,res){
    if(err){
      console.log(err);
    }else{
      console.log(res.toObject());
    }
  })
}
;var mongoose = require("mongoose");
var Prost = require('../datasets/prosts');

module.exports.postProst = function(req,res){

    var newProst = new Prost();

    newProst.user.email = req.body.userinfo.data.email;
    newProst.user.username = req.body.userinfo.data.displayName;
    newProst.user.userid = req.body.userinfo.data._id;
    newProst.user.imagepath = req.body.userinfo.data.imagePathD;
    newProst.content = req.body.prostcontent;

    // console.log(newProst.user.imagepath);
    // console.log(newProst);
    newProst.save(function(err,res){
      if(err){
        // console.log("error");
        // console.log(err);
      }else{
        console.log("success");
        // console.log(res);
      }
    })

    Prost.find({}).sort({date:-1}).exec(function(err,prosts){
        if(err){
          console.log(err);
        }else{
          res.json(prosts);
        }
    });
}


module.exports.getProst = function(req,res){
  Prost.find({}).where("content").ne(null).sort({date:-1}).exec(function(err,prosts){
      if(err){
        console.log(err);
      }else{
        res.json(prosts);
      }
  });
}
;var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Procrasts = new Schema({
    user : {
      username : String,
      email : String,
      imagepath : String,
      userid : String
    },
    content : String ,
    date : {
      type : Date,
      default : Date.now
    }
});


module.exports  = mongoose.model("Prost",Procrasts);
;var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserDetails = new Schema({
  email : {
    type :  String,
    required : true ,
    unique: true
  },
  username : String,
  password : String,
  imagePath : String,
  userbio : String,
  followers : [{userid:String,username:String}],
  following : [{userid:String,username :String}]
});

module.exports = mongoose.model("User",UserDetails);
;var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var fs = require('fs');
var authenticationController = require("./server/controller/authentication-controller");
var profileController = require("./server/controller/profile-controller");
var prostController = require("./server/controller/prost-controller");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

mongoose.connect("mongodb://localhost:27017/time-waste");

var app = express();
app.use(bodyParser.json());
app.use(multipartMiddleware);
app.use('/app',express.static(__dirname + "/app"));
app.use('/uploads',express.static(__dirname + "/uploads"));
app.use('/node_modules',express.static(__dirname + "/node_modules"));
//
app.get('/',function(req,res){
  res.end(fs.readFileSync("index.html"));
});
//Authentication
app.post("/api/user/signup",authenticationController.signup);
app.post("/api/user/login",authenticationController.login);
app.post("/api/profile/updateUserName",profileController.updateUserName);
app.post("/api/profile/updatebio",profileController.updateBio);

// get prosts testing grunt

app.get("/api/prost/get",prostController.getProst);

// Sending prosts

app.post('/api/prost/post',prostController.postProst);

// Profile Upload
app.post("/api/profile/editPhoto",multipartMiddleware, profileController.updatePhoto);
app.listen('3010',function(){
  console.log("It is working");
});
