var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Setting document for UserDetails collection
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
