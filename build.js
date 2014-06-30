var fs = require("fs"),
    browserify = require("browserify"),
    reactify = require("reactify"),
    uglifyify = require("uglifyify");

//allow import of jsx directly
require("node-jsx").install({extension:".jsx"});

var DEBUG = !!~process.argv.indexOf("--debug");

var compiler = browserify({
  extensions: [".jsx"],
  builtins: ["events"]
});

// wee need to include all the widgets.
var widgets = fs.readdirSync("lib/widgets").map(function(s){ return "lib/widgets/"+s; });

compiler
  .require("lib/bootstrap", {expose: "bootstrap"})
  .require("react")
  .add(widgets)
  .transform(reactify);

if(!DEBUG){
  compiler.transform({global: true}, uglifyify);
}

compiler
  .bundle({debug: DEBUG})
  .pipe(fs.createWriteStream("www/js/walkerboard.js"));