//webpack require for this special loader...
//but on the server side we have to do it ourselves
let loadVars;
if (!process.env.BROWSER) {
    loadVars = () => {
        const sass = require("fs").readFileSync(require.resolve("../style/base.scss"), "utf8");
        const loader = require("sass-variables-loader");
        const mod = loader.call({}, sass);
        //"module.exports = {};"
        return JSON.parse(mod.slice(17, -1));
    };
}
export default process.env.BROWSER ? require("!sass-variables!../style/base.scss") : loadVars();
