var mongoose = require("mongoose");
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
