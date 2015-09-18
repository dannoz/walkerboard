require("./webpack.shim");
require("babel/register");
require("./" + process.argv[2]);
