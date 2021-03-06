var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var fs = require('fs');

// controllers for authentication, profile maintainance, Sending prosts
var authenticationController = require("./server/controller/authentication-controller");
var profileController = require("./server/controller/profile-controller");
var prostController = require("./server/controller/prost-controller");

// dependencies for uploading image
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// setting up port
var port = 5050;

// db connection to our database
mongoose.connect("mongodb://localhost:27017/time-waste");

// defining app using express
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

// get prosts Grunt testing

app.get("/api/prost/get",prostController.getProst);

// Sending prosts

app.post('/api/prost/post',prostController.postProst);

// Profile Upload
app.post("/api/profile/editPhoto",multipartMiddleware, profileController.updatePhoto);

app.listen(port,function(){
  console.log("Listening to port : "+ port);
});
