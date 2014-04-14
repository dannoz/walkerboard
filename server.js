var express = require("express");

var app = express();

app.use(express.static(__dirname+"/www"));

var PORT = process.env.NODE_PORT||8000;

app.listen(PORT, function(){
  console.log("WalkerBoard running at http://localhost:%d/", PORT);
});