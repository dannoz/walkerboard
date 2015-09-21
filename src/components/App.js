import React from "react";
import DashboardManager from "../lib/DashboardManager";
import Header from "./Header";
import Panels from "./Panels";
import Loading from "./Loading";
import BoardError from "./BoardError";
import LoadNewBoardModal from "./LoadNewBoardModal";

//webpack load css
require("./App.scss");


export default React.createClass({
    displayName: "App",
    propTypes: {
        dash: React.PropTypes.instanceOf(DashboardManager).isRequired
    },
    componentDidMount() {
        this.props.dash.registerCallback(state => this.setState({ dash: state }));
    },
    getInitialState() {
        return {
            dash: this.props.dash.getState(),
            openModal: false
        };
    },
    render() {
        return <div>
            {this.state.dash.boards.when({
                pending: () => <Loading>
                        <p>Loading WalkerBoard...</p>
                        <p><code>{this.props.dash.url}</code></p>
                    </Loading>,
                error: err => <BoardError error={err} url={this.props.dash.url} onOpenModal={this.openModal} />,
                ok: boards => {
                    //now we are rendering a single board from the many.
                    const onRefreshPanelData = index => this.props.dash.refreshPanelData(index);
                    return <div>
                        <Header branding={this.props.dash.branding} boards={boards} current={this.state.dash.current} onChangeBoard={index => this.changeDashboard(index)} onOpenModal={this.openModal} />
                        {this.renderPanels(this.state.dash.board, this.state.dash.panels, onRefreshPanelData)}
                    </div>;
                }
            })}
            <LoadNewBoardModal visible={this.state.openModal} onClose={() => this.setState({ openModal: false })}/>
        </div>;
    },
    renderPanels(board, panelData, refreshPanelData) {
        return board.when({
            pending: () => <Loading />,
            error: err => <BoardError error={err} url={this.props.dash.url} />,
            ok: boardData => <Panels width={boardData.size.width} panels={boardData.panels} data={panelData} onRefreshPanelData={refreshPanelData} />
        });
    },
    changeDashboard(index) {
        this.props.dash.changeDashboard(index);
    },
    shouldComponentUpdate(nextProps, nextState) {
        //we can ignore props, they won't change
        //state.dash has "board" and "panels". Board is a maybe, and panels is an array of maybes.
        //but the panels array is immutable. so we can check easily.
        return this.state.openModal !== nextState.openModal || this.state.dash !== nextState.dash;
    },
    openModal() {
        this.setState({ openModal: true });
    }
});
