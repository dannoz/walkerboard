import React from "react";
import Maybe from "../lib/Maybe";
import Panel from "./Panel";

//import styles for the board
require("./Panels.scss");

export default React.createClass({
    displayName: "Panels",
    propTypes: {
        panels: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        data: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Maybe)).isRequired,
        onRefreshPanelData: React.PropTypes.func.isRequired
    },
    render() {
        return <div className="panel-container">
            {this.props.panels.map((panel, index) => <Panel key={`panel-${index}`} definition={panel} data={this.props.data[index]} onRefresh={() => this.props.onRefreshPanelData(index)} />)}
        </div>;
    }
});
