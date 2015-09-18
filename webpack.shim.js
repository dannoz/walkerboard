/**
 *  For webpack on the server-side
 *  We ignore the scss imports.
 */
//don't load at all.
require.extensions[".scss"] = function(m) {
    return m;
};

//ignore "!" loads.
var oldResolve = require._resolveFileName;
require._resolveFileName = function(name) {
    if (name.indexOf("!") > -1) {
        name = name.split("!").pop();
    }
    return oldResolve.call(require, name);
};
