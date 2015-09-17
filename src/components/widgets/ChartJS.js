import React from "react";
import PanelError from "../PanelError";
import ChartJs from "react-chartjs";

const defaultOptions = {
    multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>"
};

const defaultColors = [
    {
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)"
    }, {
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)"
    }
];

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
        const chartData = Object.assign({}, this.props.data.data);
        const options = Object.assign({}, this.props.data.options || {}, defaultOptions);
        return <Type data={chartData} options={options} width={this.props.size.width} height={this.props.size.height} />;
    }
});
