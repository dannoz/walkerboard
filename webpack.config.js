var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

var webpackConfig = {
    entry: [ "./src/bootstrap.js" ],
    output: {
        path: "./dist",
        filename: "walkerboard.js"
    },
    module: {
        loaders: [
            {   //this one is first, we reference it in the development section.
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("css!sass?outputStyle=compact", { allChunks: true })
            },
            {   //don't include *.demo.js files...
                test: /\.demo\.js$/,
                exlude: /node_modules/,
                loader: "null"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel",
                query: {
                    stage: 0,
                    optional: ["runtime"]
                }
            }
        ]
    },
    plugins: [
        // extract inline css into separate file
        new ExtractTextPlugin("walkerboard.css"),
        new webpack.DefinePlugin({
            "process.env": Object.keys(process.env).reduce(function(env, key) {
                env[key] = JSON.stringify(process.env[key]);
                return env;
            }, { BROWSER: "true" })
        })
    ]
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    //Add the hot-loader and dev stuff
    console.log("loading dev server");
    webpackConfig.entry.unshift("webpack/hot/dev-server");
    webpackConfig.devtool = "inline-source-map";
    webpackConfig.module.postLoaders = webpackConfig.module.postLoaders || [];
    webpackConfig.module.postLoaders.push({ test: /components\/(widgets\/|)[^\/]+\.js$/, exclude: /node_modules/, loader: "react-hot" });
    //overwrite with the sourcemap generating one with HMR
    webpackConfig.module.loaders[0].loader = "style!css?sourceMap!sass?outputStyle=expanded&sourceMap";
}


module.exports = webpackConfig;
