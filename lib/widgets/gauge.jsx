/** @jsx React.DOM */
var React = require("react"),
    ErrorMsg = require("lib/error_msg"),
    WidgetRegistry = require("lib/widget_registry");
/**
 * The Gauge widget.
 * Interesting use of state and props as the render creates dom, but never
 * changes, only the canvas is re-drawn.
 */
WidgetRegistry.add("gauge", React.createClass({
  displayName: "Gauge",
  componentDidMount: function() {
    var canvas = this.refs.arc.getDOMNode();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.paint(canvas);
  },
  componentDidUpdate: function() {
    var canvas = this.refs.arc.getDOMNode();
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    this.paint(canvas);
  },
  paint: function(canvas){
    this.getData(function(err, label, min, max, value){
      if(err != null){
        //balls, how to handle this? it really shouldn't happen.
        return;
      }
      var ctx = canvas.getContext("2d"),
        x = canvas.width / 2,
        y = canvas.height * 0.8,
        p = (value-min) / (max-min),
        thick = canvas.height/4,
        radius = Math.min(canvas.width, canvas.height)*0.49,
        startAngle = 1.2 * Math.PI,
        endAngle = 1.8 * Math.PI,
        counterClockwise = false,
        endPercent = (0.6 * Math.PI * p) + startAngle,
        color = p < 0.5 ? "red" : "green";

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      ctx.lineWidth = thick;
      ctx.strokeStyle = "black";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endPercent, counterClockwise);
      ctx.lineWidth = thick;
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  },
  getData: function(cb) {
    var min = 0, max = 100, value, label;
    try{
      var jsdata = JSON.parse(this.props.data);
      if(! ("value" in jsdata)){
        return cb(<ErrorMsg msg="No Value in Data"/>);
      }
      value = jsdata.value;

      if("label" in  jsdata){
        label = jsdata.label;
      }else{
        label = jsdata.value;
      }

      if("min" in jsdata){
        min = jsdata.min;
      }

      if("max" in jsdata){
        max = jsdata.max;
      }
    }catch(e){
      console.error("Gauge:", e);
      return cb(<ErrorMsg msg="Invalid Data"/>);
    }
    return cb(null, label, min, max, value);
  },
  render: function(){
    var error, label="", style = "normal";
    this.getData(function(err, l, mn, mx, v){
      error = err;
      label = l;
      style = (v-mn)/(mx-mn) < 0.5 ? "low" : "high";
    });
    if(error !== null){
      return error;
    }
    return <div className="gauge-wrap">
      <canvas className="widget-canvas" ref="arc"></canvas>
      <h1 className={"gauge-label gauge-"+style}>{label}</h1>
    </div>;
  }
}));