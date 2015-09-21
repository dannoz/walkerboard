/**
 *  Module for setting/reading info from the URL querystring
 *  importantly we only care about specific keys.
 */
import qs from "querystring";

const appKeys = [ "board", "tab" ];

const appKeysOnly = (obj, { isDecode }) => {
    const codec = isDecode ? decodeURIComponent : encodeURIComponent;
    return appKeys.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = codec(obj[key]);
        }
        return acc;
    }, {});
};

export function setQuery(obj) {
    window.location.assign(`?${qs.stringify(appKeysOnly(obj, { isDecode: false }))}`);
}

export function getQuery() {
    return appKeysOnly(qs.parse(window.location.search.replace(/^\?/, "")), { isDecode: true });
}

export function replaceQuery(obj) {
    window.history.replaceState(null, null, `?${qs.stringify(appKeysOnly(obj, { isDecode: false }))}`);
}
