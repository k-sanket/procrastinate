var User =  require('../datasets/users');
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
