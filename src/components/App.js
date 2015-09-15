import React from "react";
import DashboardManager from "../lib/DashboardManager";
import Header from "./Header";
import Panels from "./Panels";
import Loading from "./Loading";
import BoardError from "./BoardError";

//webpack load css
require("./App.scss");


export default React.createClass({
    displayName: "App",
    propTypes: {
        dash: React.PropTypes.instanceOf(DashboardManager).isRequired
    },
    componentDidMount() {
        this.props.dash.registerCallback(state => this.setState(state));
        const savedIndex = window.localStorage[`walkerboard:${this.props.dash.url}:currentIndex`];
        if (savedIndex) { //default is zero anyway so the fact that this could be 0 and falsy is irrelevent
            this.changeDashboard(savedIndex);
        }
    },
    getInitialState() {
        return this.props.dash.getState();
    },
    render() {
        return this.state.boards.when({
            pending: () => <Loading url={this.props.dash.url} />,
            error: err => <BoardError error={err} url={this.props.dash.url} />,
            ok: boards => {
                //now we are rendering a single board from the many.
                const onRefreshPanelData = index => this.props.dash.refreshPanelData(index);
                return <div>
                    <Header branding={this.props.dash.branding} boards={boards} current={this.state.current} onChangeBoard={index => this.changeDashboard(index)} />
                    {this.renderPanels(this.state.board, this.state.panels, onRefreshPanelData)}
                </div>;
            }
        });
    },
    renderPanels(board, panelData, refreshPanelData) {
        return board.when({
            pending: () => <Loading />,
            error: err => <BoardError error={err} />,
            ok: boardData => <Panels panels={boardData.Panels} data={panelData} onRefreshPanelData={refreshPanelData} />
        });
    },
    changeDashboard(index) {
        //remember the index in localstorage for next time.
        const newIndex = this.props.dash.changeDashboard(index);
        window.localStorage[`walkerboard:${this.props.dash.url}:currentIndex`] = newIndex;
    },
    shouldComponentUpdate(nextProps, nextState) {
        //we can ignore props, they won't change
        //state has "board" and "panels". Board is a maybe, and panels is an array of maybes.
        //but the panels array is immutable. so we can check easily.
        return this.state.board !== nextState.board || this.state.panels !== nextState.panels;
    }
});
