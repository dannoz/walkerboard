/**
 *  This is the core of walkerboard.
 *  It represents a single dashboard. You may define more than one in your root definition.
 *  It handles the position and the status of all panels.
 *  It should be available to the React Board component as
 *  context, so it can pass data to the panel objects.
 */
import Maybe from "./Maybe";
import Widgets from "../components/Widgets";
import { fetchJSONIfPossible } from "./util";

const invalidError = reason => new Error(`Invalid Board JSON (${reason})`);

//this is the validator root, with a try catch.
function validateDashboard(def) {
    try {
        return validateBoardData(def);
    } catch (err) {
        return err;
    }
}

//this function ensure the board data we get from a request is in the correct format.
function validateBoardData(data) {
    if (typeof data.Title !== "string") {
        throw invalidError("no string 'Title' attribute");
    }
    if (!Array.isArray(data.Panels)) {
        throw invalidError("no array in the 'Panels' attribute");
    }
    data.Panels.forEach(validatePanelDefinition);
    return data;
}

//check a panel definition is valid
function validatePanelDefinition(panel, index) {
    ["Update", "X", "Y", "W", "H"].forEach(prop => {
        if (typeof panel[prop] !== "number" || Math.round(panel[prop]) !== panel[prop]) {
            throw invalidError(`Panel[${index}] has no integer value for '${prop}'`);
        }
    });
    //NB we don't validate that the url is valid here.
    if (typeof panel.Url !== "string") {
        throw invalidError(`Panel[${index}] has no string 'Url' attribute`);
    }
    if (typeof panel.Title !== "string") {
        throw invalidError(`Panel[${index}] has no string 'Title' attribute`);
    }
    if (typeof panel.Type !== "string") {
        throw invalidError(`Panel[${index}] has no string 'Type' attribute`);
    }
    if (!Widgets.has(panel.Type)) {
        throw invalidError(`Panel[${index}] has unknown Type: '${panel.Type}'`);
    }
}

const $interval = Symbol("interval");
const $index = Symbol("index");

export default class Dashboard {
    constructor(definition, { fetch, notify } = {}) {
        this.boardData = Maybe(validateDashboard(definition));
        this.notify = notify;
        this.fetch = fetch;
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
                this.panelData = data.Panels.map(() => Maybe()); //all are loading initially
                data.Panels.forEach((panel, index) => {
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
        panel[$interval] = window.setInterval(() => {
            this.setPanelData(panel, Maybe());
            this.updatePanel(panel);
        }, panel.Update * 1e3); //schedule updates.
    }

    stopInterval(panel) {
        window.clearInterval(panel[$interval]);
    }

    updatePanel(panel) {
        //try a JSON conversion, but return the plain text if that failsß
        fetchJSONIfPossible(this.fetch, panel.Url)
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
                const panel = data.Panels[index];
                if (panel && !this.panelData[index].isPending) {
                    //OK panel exists and is not currently loading - we can refresh it.
                    this.stopInterval(panel);
                    this.initPanel(panel, index);
                }
            }
        });
    }
}
