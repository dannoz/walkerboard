import githubFetch from "whatwg-fetch";

//we bind the window.fetch to window to make it easier to use.
export default window.fetch ? window.fetch.bind(window) : githubFetch;
