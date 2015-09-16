import React from "react";
import ChartJs from "react-chartjs";

export default React.createClass({
    displayName: "ChartJSWidget",
    render() {
        var Type = ChartJs[this.props.data.type];
        return <Type data={this.props.data.data} width="630" height="250" />;
    }
});
