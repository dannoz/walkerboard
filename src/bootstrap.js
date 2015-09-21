import React from "react";
import App from "./components/App";
import DashboardManager from "./lib/DashboardManager";
import fetch from "./lib/fetch";
import { getQuery, setQuery, onQueryChange } from "./lib/querystring";

// Get our board url. We will completely reload the page on hashchange.
// Sources of truth = "querystring" > "window.localStorage" > "board.json"
const query = getQuery();
if (!query.board) {
    setQuery({ board: "board.json" });
}

//Generate a Dashboard instance (this is like the flux store and dispatcher in one)
const dashboard = new DashboardManager(query, { fetch });

//now hook the popstate listener into the dashboard
onQueryChange((newQuery) => dashboard.changeDashboard(newQuery.tab || 0));

//render to page.
React.render(<App dash={dashboard} />, document.getElementById("app"));

