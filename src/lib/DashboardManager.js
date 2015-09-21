/**
 *  Manages a group of dashboard's from a definition JSON.
 */
import Dashboard from "./Dashboard";
import Maybe from "./Maybe";
import { fetchJSONIfPossible, error } from "./util";
import { replaceQuery } from "./querystring";

const $notify = Symbol("notify");
const $callbacks = Symbol("callbacks");
const $state = Symbol("state");

export default class DashboardManager {
    constructor({ board, tab = 0 } = {}, { fetch } = {}) {
        this.url = board;
        this.branding = {
            logo: false,
            text: "WalkerBoard",
            url: "https://github.com/thechriswalker/walkerboard"
        };
        this.boards = Maybe(); //pending initially
        this.currentBoard = tab;
        this.fetch = fetch; //the http request library
        this[$callbacks] = [];
        //notify callbacks.
        //this is here so state updates only happen on notify
        const getState = () => ({
            boards: this.boards,
            current: this.currentBoard,
            board: this.boards.when({
                ok: boards => boards[this.currentBoard].boardData
            }),
            panels: this.boards.when({
                ok: boards => boards[this.currentBoard].panelData
            })
        });
        //load initial state.
        this[$state] = getState();


        //but only once an event loop.
        let notifyInProgress = false;
        this[$notify] = () => {
            if (!notifyInProgress) {
                notifyInProgress = true;
                process.nextTick(() => {
                    this[$state] = getState();
                    notifyInProgress = false;
                    this[$callbacks].map(fn => fn(this[$state]));
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
        return this[$state];
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
                    boards[this.currentBoard].pause();
                    this.currentBoard = index;
                    boards[this.currentBoard].resume();
                    replaceQuery({ board: this.url, tab: this.currentBoard });
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
            if (typeof result === "string") {
                try {
                    result = JSON.parse(result);
                } catch (err) {
                    manager.boards = Maybe(error(`Invalid JSON: ${err.message}`));
                    return;
                }
            }
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
    const loaded = obj.boards.map(board => new Dashboard(board, { boardUrl: manager.url, fetch: manager.fetch, notify: () => manager[$notify]() }));
    if (!loaded[manager.currentBoard]) {
        manager.currentBoard = 0;
    }
    loaded[manager.currentBoard].resume();
    return loaded;
}
