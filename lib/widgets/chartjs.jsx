/** @jsx React.DOM */
/* jshint quotmark: false */
var React = require("react"),
    _ = require("lodash"),
    ErrorMsg = require("lib/error_msg"),
    ChartJS = require("Chart.js/Chart"),
    WidgetRegistry = require("lib/widget_registry");
/**
 * The Chartjs widget.
 */

// see http://www.chartjs.org/docs/ for info.
//data should be in the form: {"type": "Line", "data": { ... }, "options": { ... }};
WidgetRegistry.add("chartjs", React.createClass({
  displayName: "ChartJS",
  render: function(){
    try {
      var o = JSON.parse(this.props.data);
      //type should be an available type
      if(!o.type || !(o.type in ChartJS.types)){
        return <ErrorMsg msg="Invalid Data (Bad Chart Type)"/>;
      }
    }catch(e){
      return <ErrorMsg msg="Invalid Data (Bad JSON)"/>;
    }
    return <canvas className="widget-canvas" ref="chart" />;
  },
  setCanvasSize: function(){
    if(!("chart" in  this.refs)){ return; }
    var el = this.refs.chart.getDOMNode();
    el.width = el.offsetWidth;
    el.height = el.offsetHeight;
  },
  draw: function(){
    if(!("chart" in  this.refs)){ return; }
    var data;
    try {
      data = JSON.parse(this.props.data);
      //type should be an available type
      if(!data.type || !(data.type in ChartJS.types)){
        //handled in render
        return;
      }
    }catch(e){
      //handled in render.
      return;
    }
    var ctx = this.refs.chart.getDOMNode().getContext("2d");
    data.data = data.data||{};
    if(data.data.datasets){
      data.data.datasets = data.data.datasets.map(function(set, idx){
        //map in the default colors.
        return _.extend({}, colors[idx % colors.length], set);
      });
    }
    this.chart = new ChartJS(ctx)[data.type](data.data, data.options||{});

  },
  componentDidMount: function(){
    //find the size of the component and resize our canvas to fit.
    this.setCanvasSize();
    this.draw();
  },
  componentDidUpdate: function(){
    if(this.chart){
      this.chart.destroy();
      this.chart = null;
    }
    this.draw();
  }
}));


var colors = [
  { fillColor: "rgba(220,220,220,0.2)",
    strokeColor: "rgba(220,220,220,1)",
    pointColor: "rgba(220,220,220,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,220,1)" },
  { fillColor: "rgba(151,187,205,0.2)",
    strokeColor: "rgba(151,187,205,1)",
    pointColor: "rgba(151,187,205,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(151,187,205,1)" }
];