import React from "react";
import App from "./components/App";
import DashboardManager from "./lib/DashboardManager";

//where we store the last board accessed
const LOCAL_STORAGE_KEY = "walkerboard:boardURL";

// Get our board url. We will completely reload the page on hashchange.
// Sources of truth = "hash fragment" > "window.localStorage" > "board.json"
let boardUrl = (window.location.search + "").replace(/^\?/, "");
if (!boardUrl) {
    boardUrl = window.localStorage && window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!boardUrl) {
        boardUrl = "board.json";
    }
    window.location.assign(`?${encodeURIComponent(boardUrl)}`);
} else {
    //if it came from has, url decode
    boardUrl = decodeURIComponent(boardUrl);
}

//save to localStorage
if (window.localStorage) {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, boardUrl);
}

//Generate a Dashboard instance (this is like the flux store and dispatcher in one)
const dashboard = new DashboardManager(boardUrl, { fetch: (...args) => window.fetch(...args) });

//render to page.
React.render(<App dash={dashboard} />, document.getElementById("app"));
