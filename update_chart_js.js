var fs = require("fs");

//chart.js source
var chartURL = "https://raw.githubusercontent.com/nnnick/Chart.js/master/Chart.js";

//http or https
var http = chartURL.match(/^https/) ? require("https") : require("http");

var writeStream = fs.createWriteStream("./lib/vendor/chart.js", "utf8");

http.get(chartURL, function(res){
  res.on("end", function(){
      console.log("done");
  });
  res.on("error", function(err){
    console.log("error", err);
  });
  res.pipe(writeStream);
}).on("error", function(err){
  console.log("error", err);
});