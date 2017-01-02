var mongoose = require("mongoose");
var Prost = require('../datasets/prosts');


// Posting tweets
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

// Getting tweets
module.exports.getProst = function(req,res){
  Prost.find({}).where("content").ne(null).sort({date:-1}).exec(function(err,prosts){
      if(err){
        console.log(err);
      }else{
        res.json(prosts);
      }
  });
}
