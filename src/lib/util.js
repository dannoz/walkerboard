/**
 *  Utility functions
 */


/**
 *  Small utility for window.fetch to get JSON
 *  if available, or text if not as a fallback
 */
export const fetchJSONIfPossible = function(fetch, url) {
    return fetch(url)
        .then(response => {
            //get the text here so we have it even in an error situation.
            return response.text()
                .then(tryToJSONParse)
                .then(output => {
                    //if status is 4xx/5xx
                    if (Math.floor(response.status / 100) > 3) {
                        const err = new Error(`HTTP Error ${response.status}`);
                        err.body = output;
                        throw err;
                    }
                    return output;
                });
        });
};

//attempt to parse json, but if it fails, return the raw text
function tryToJSONParse(text) {
    let obj;
    try {
        obj = JSON.parse(text);
    } catch (e) {
        //never mind...
        obj = text;
    }
    return obj;
}
