/**
 *  Manages a group of dashboard's from a definition JSON.
 */
import Dashboard from "./Dashboard";
import Maybe from "./Maybe";
import { fetchJSONIfPossible } from "./util";

const $notify = Symbol("notify");
const $callbacks = Symbol("callbacks");

export default class DashboardManager {
    constructor(url, { fetch } = {}) {
        this.url = url;
        this.branding = {
            Logo: false,
            Text: "WalkerBoard"
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
                    this[$callbacks].map(fn => fn(state));
                    notifyInProgress = false;
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
                ok: boards => boards[this.currentBoard].boardData,
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
            if (result.Branding) {
                manager.branding = Object.assign({}, manager.branding, result.Branding);
            }
        }, error => {
            manager.boards = Maybe(error);
        })
        .then(() => manager[$notify]());
}


//ensure the boards have been loaded
function initialiseBoards(manager, obj) {
    if (!Array.isArray(obj.Boards)) {
        //could be a single. benefit of the doubt and all that...
        obj = { Boards: [obj] };
    }
    return obj.Boards.map(board => new Dashboard(board, { fetch: manager.fetch, notify: () => manager[$notify]() }));
}
