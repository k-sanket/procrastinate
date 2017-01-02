var mongoose = require("mongoose");
var User =  require('../datasets/users');

// Signup a user
module.exports.signup =  function(req,res){
   var user =  new User(req.body);
   user.save();
   res.json(req.body);
}


// Sign in a user
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
