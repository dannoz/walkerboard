import React from "react";
import cx from "classnames";
import { setQuery } from "../lib/querystring";

require("./LoadNewBoardModal.scss");

export default React.createClass({
    displayName: "LoadNewBoardModal",
    propTypes: {
        onClose: React.PropTypes.func.isRequired,
        visible: React.PropTypes.bool.isRequired
    },
    getInitialState() {
        return {
            open: false,
            closing: false,
            opening: false
        };
    },
    render() {
        const className = cx({
            modal: true,
            fade: true,
            in: !(this.state.opening || this.state.closing)
        });
        const style = { display: this.state.open || this.state.opening || this.state.closing ? "block" : "none" };

        return <div style={style} className={className} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Enter URL of new board definition</h4>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="board-url">Board URL</label>
                            <input type="url" id="board-url" className="form-control" placeholder="https://" />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={() => this.props.onClose()} className="btn btn-default">Cancel</button>
                        <button type="button" onClick={this.onSubmit} className="btn btn-primary">Load New Board</button>
                    </div>
                </div>
            </div>
        </div>;
    },
    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps.visible);
    },
    componentWillMount() {
        this.updateState(this.props.visible);
    },
    updateState(shouldBeOpen) {
        const newState = {};
        if (this.state.open && !shouldBeOpen) {
            newState.open = false;
            newState.closing = true;
            //this is not perfect but for all but the most insane circumstances it will work as expected.
            //worst case is a close happens too fast.
            setTimeout(() => this.setState({ closing: false }), 400);
        }
        if (!this.state.open && shouldBeOpen) {
            newState.open = true;
            newState.opening = true;
            process.nextTick(() => this.setState({ opening: false }));
        }
        this.setState(newState);
    },
    onSubmit(ev) {
        const location = ev.target.value;
        setQuery({ board: location, tab: 0 });
    }

});
