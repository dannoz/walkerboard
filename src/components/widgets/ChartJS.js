import React from "react";
import PanelError from "../PanelError";
import ChartJs from "react-chartjs";
import { createClass } from "react-chartjs/lib/core";

require("../../lib/HorizontalBar.js");

ChartJs.HorizontalBar = createClass("HorizontalBar", ["getBarsAtEvent"]);

const defaultOptions = {
    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
};

export default React.createClass({
    displayName: "ChartJSWidget",
    render() {
        if (typeof this.props.data === "string") {
            return <PanelError msg={`Invalid Chart Data: not JSON`} />;
        }
        if (!("data" in this.props.data)) {
            return <PanelError msg={"No `data` property in JSON"} />;
        }
        var Type = ChartJs[this.props.data.type];
        if (!Type) {
            return <PanelError msg={`Invalid Chart type: ${this.props.data.type}`} />;
        }
        const chartData = Array.isArray(this.props.data.data) ? this.props.data.data.slice() : Object.assign({}, this.props.data.data);
        const options = Object.assign({}, this.props.data.options || {}, defaultOptions);
        return <Type data={chartData} options={options} width={this.props.size.width} height={this.props.size.height} />;
    },
    statics: require("./ChartJS.demo")
});


