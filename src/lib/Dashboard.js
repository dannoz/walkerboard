/**
 *  This is the core of walkerboard.
 *  It represents a single dashboard. You may define more than one in your root definition.
 *  It handles the position and the status of all panels.
 *  It should be available to the React Board component as
 *  context, so it can pass data to the panel objects.
 */
import Maybe from "./Maybe";
import Widgets from "../components/Widgets";
import { fetchJSONIfPossible, error } from "./util";
import { resolve } from "url";

const invalidError = reason => error(`Invalid Board JSON (${reason})`);

//this is the validator root, with a try catch.
function validateDashboard(def, url) {
    try {
        return validateBoardData(def, url);
    } catch (err) {
        return err;
    }
}

//this function ensure the board data we get from a request is in the correct format.
function validateBoardData(data, url) {
    if (data.title && typeof data.title !== "string") {
        // actually we don't care about this...
        data.title = url;
    }
    if (!Array.isArray(data.panels)) {
        throw invalidError("no array in the 'panels' attribute");
    }
    data.panels.forEach(validatePanelDefinition);
    return data;
}

//check a panel definition is valid
function validatePanelDefinition(panel, index) {
    ["x", "y", "w", "h"].forEach(prop => {
        if (typeof panel[prop] !== "number" || Math.round(panel[prop]) !== panel[prop]) {
            throw invalidError(`Panel[${index}] has no integer value for '${prop}'`);
        }
    });
    //NB we don't validate that the url is valid here.
    //also a panel might have a static data source in "data".
    if ("data" in panel) {
        // if data, we should not have update or url.
        if (("update" in panel) || ("url" in panel)) {
            throw invalidError(`Panel[${index} has both a 'data' attribute and an 'update' or 'url' attribute`);
        }
    } else {
        if (typeof panel.url !== "string") {
            throw invalidError(`Panel[${index}] has no string 'url' attribute`);
        }
        if (typeof panel.update !== "number" || Math.round(panel.update) !== panel.update) {
            throw invalidError(`Panel[${index}] has no integer value for 'update'`);
        }
    }
    if (panel.title && typeof panel.title !== "string") {
        throw invalidError(`Panel[${index}] has no string 'title' attribute`);
    }
    if (typeof panel.type !== "string") {
        throw invalidError(`Panel[${index}] has no string 'type' attribute`);
    }
    if (!Widgets.has(panel.type)) {
        throw invalidError(`Panel[${index}] has unknown Type: '${panel.type}'`);
    }
}

const $interval = Symbol("interval");
const $index = Symbol("index");

export default class Dashboard {
    constructor(definition, { boardUrl, fetch, notify } = {}) {
        this.boardData = Maybe(validateDashboard(definition));
        this.notify = notify;
        this.fetch = fetch;
        this.boardUrl = boardUrl;
        this.init();
    }

    //stop any network transfer/updates for this board.
    pause() {
        if (!this.paused) {
            this.paused = true;
            this.boardData.when({
                ok: data => data.Panels.forEach(panel => this.stopInterval(panel))
            });
            this.notify();
        }
    }

    resume() {
        if (this.paused) {
            this.paused = false;
            this.boardData.when({
                ok: data => data.Panels.forEach(panel => this.startInterval(panel))
            });
            this.notify();
        }
    }

    // Initialise a new board from the url.
    init() {
        this.boardData.when({
            ok: data => {
                // load panels, and set the initial panel data.
                this.panelData = data.panels.map(() => Maybe()); //all are loading initially
                data.panels.forEach((panel, index) => {
                    //this only happens the very first time. so here we change the url
                    //from boardUrl relative to absolute
                    if (panel.url) {
                        panel.url = resolve(this.boardUrl, panel.url);
                    }
                    this.initPanel(panel, index);
                });
                this.notify();
            }
        });
    }

    initPanel(panel, index) {
        panel[$index] = index;
        panel.lastUpdated = null;
        this.updatePanel(panel); //do initial load
        this.startInterval(panel);
    }

    startInterval(panel) {
        if (panel.url) {
            panel[$interval] = window.setInterval(() => {
                this.setPanelData(panel, Maybe());
                this.updatePanel(panel);
            }, panel.update * 1e3); //schedule updates.
        }
    }

    stopInterval(panel) {
        if (panel.url) {
            window.clearInterval(panel[$interval]);
        }
    }

    updatePanel(panel) {
        if ("data" in panel) {
            this.setPanelData(panel, Maybe(panel.data));
            this.notify();
            return;
        }
        //try a JSON conversion, but return the plain text if that failsß
        fetchJSONIfPossible(this.fetch, panel.url)
            .catch(error => {
                //we store the error just like valid data...
                return error;
            })
            .then(data => {
                //console.log(`panel data for ${panel.Title}`, data);
                panel.lastUpdated = new Date();
                this.setPanelData(panel, Maybe(data));
                this.notify();
            });
        this.notify();
    }

    //helper to keep panelData immutable, splice in data and slice();
    setPanelData(panel, data) {
        this.panelData.splice(panel[$index], 1, data);
        this.panelData = this.panelData.slice(); //copy the array. (immutable.js would probably be a more performant solution...)
    }

    refreshPanelData(index) {
        this.boardData.when({
            ok: data => {
                const panel = data.panels[index];
                if (panel && !this.panelData[index].isPending) {
                    //OK panel exists and is not currently loading - we can refresh it.
                    this.stopInterval(panel);
                    this.initPanel(panel, index);
                }
            }
        });
    }
}
