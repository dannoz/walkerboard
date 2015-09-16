/**
 *  Manages a group of dashboard's from a definition JSON.
 */
import Dashboard from "./Dashboard";
import Maybe from "./Maybe";
import { fetchJSONIfPossible, error } from "./util";

const $notify = Symbol("notify");
const $callbacks = Symbol("callbacks");

export default class DashboardManager {
    constructor(url, { fetch } = {}) {
        this.url = url;
        this.branding = {
            logo: false,
            text: "WalkerBoard",
            url: "https://github.com/thechriswalker/walkerboard"
        };
        this.boards = Maybe(); //pending initially
        this.currentBoard = 0;
        this.fetch = fetch; //the http request library
        this[$callbacks] = [];

        //notify callbacks.
        //but only once an event loop.
        let notifyInProgress = false;
        this[$notify] = () => {
            if (!notifyInProgress) {
                notifyInProgress = true;
                process.nextTick(() => {
                    const state = this.getState();
                    notifyInProgress = false;
                    this[$callbacks].map(fn => fn(state));
                });
            }
        };
        this.fetch = fetch;
        load(this);
    }

    registerCallback(fn) {
        this[$callbacks].push(fn);
    }

    getState() {
        return {
            boards: this.boards,
            current: this.currentBoard,
            board: this.boards.when({
                ok: boards => boards[this.currentBoard].boardData
            }),
            panels: this.boards.when({
                ok: boards => boards[this.currentBoard].panelData
            })
        };
    }

    refreshPanelData(index) {
        this.boards.when({
            ok: boards => boards[this.currentBoard].refreshPanelData(index)
        });
    }

    changeDashboard(index) {
        this.boards.when({
            ok: boards => {
                if (boards[index]) {
                    this.currentBoard = index;
                    this[$notify]();
                }
            }
        });
    }
}

//load the Description JSON.
function load(manager) {
    fetchJSONIfPossible(manager.fetch, manager.url)
        .then(result => {
            manager.boards = Maybe(initialiseBoards(manager, result));
            if (result.branding) {
                manager.branding = Object.assign({}, manager.branding, result.branding);
            }
        }, err => {
            manager.boards = Maybe(err);
        })
        .then(() => manager[$notify]());
}


//ensure the boards have been loaded
function initialiseBoards(manager, obj) {
    if (!Array.isArray(obj.boards)) {
        //could be a single. benefit of the doubt and all that...
        obj = { boards: [obj] };
    }
    if (obj.boards.length === 0) {
        return error("No dashboards defined");
    }
    return obj.boards.map(board => new Dashboard(board, { boardUrl: manager.url, fetch: manager.fetch, notify: () => manager[$notify]() }));
}
