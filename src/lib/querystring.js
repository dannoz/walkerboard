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

export function makeURL(obj) {
    return `?${qs.stringify(appKeysOnly(obj, { isDecode: false }))}`;
}

export function getQuery() {
    return appKeysOnly(qs.parse(window.location.search.replace(/^\?/, "")), { isDecode: true });
}

const html5HistorySupported = window.history && window.history instanceof window.History;

export function setQuery(obj) {
    const current = getQuery();
    // change of board requires reload.
    if (obj.board !== current.board) {
        window.location.reload();
    }
    //otherwise just a dashboard tab update if needed
    //string coercion is needed as they could be numbers.
    //parseInt is bad as it might be NaN and NaN !== NaN => true
    if (obj.tab.toString() !== current.tab.toString()) {
        if (!html5HistorySupported) {
            window.location.reload();
        }
        window.history.pushState(null, null, makeURL(obj));
    }
}

const listeners = [];
const triggerListeners = () => {
    const query = getQuery();
    listeners.forEach(fn => fn(query));
};

//trigger on popstate.
if (html5HistorySupported) {
    window.addEventListener("popstate", triggerListeners);
}

export function onQueryChange(fn) {
    listeners.push(fn);
}
