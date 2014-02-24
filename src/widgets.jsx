/**
 * @jsx React.DOM
 */
/**
 * Widgets add themselves to this global object.
 */
var WidgetRegistry = {};
 //the Widget React Component
 var Widget = React.createClass({
  render: function(){
    //check for widget existence and render or error
    if(this.props.which in WidgetRegistry){
      return WidgetRegistry[this.props.which]({data: this.props.data});
    }else{
      return <Error msg={"Widget '"+this.props.which+"' not found."} />;
    }
  }
 });

//Error messages broken out for ease to change
var Error = React.createClass({
  render: function(){
    return <h2 className="error"><span className="label label-danger">{this.props.msg}</span></h2>;
  }
 });

 /**
  * ValueAndSecondary widget.
  */
 var ValueAndSecondary = React.createClass({
  render: function(){
    var main = "", sub = 0, jsdata;
    try{
      jsdata = JSON.parse(this.props.data);
      main = jsdata.item[0].value
    }catch(e){
      console.error(e);
      console.log(this.props);
      return <Error msg="Invalid Data"/>;
    }
    try {
      sub = (100 * main / jsdata.item[1].value);
    }catch(e){}
    return (
      <div>
        <h1 className="main">{this.formatNumber(main)}</h1>
        {sub ? <p className={sub<100 ? "sub sub-down" : "sub sub-up"}>{sub.toFixed(2)+"%"}</p> : null}
      </div>
    );
  },
  trimRightZeroes: function(s){
    //don't trim non-decimal places.
    if(s.indexOf(".") < 0){ return s; }
    while(s[s.length-1]==="0"){
      s = s.substring(0, s.length-1);
    }
    //remove the dot. if there is one
    if(s[s.length-1]==="."){
      s = s.substring(0, s.length-1);
    }
    return s;
  },
  formatNumber: function(num){
    var sizes = ["","K","M"];
    if (num == 0) return '0';
    var i = parseInt(Math.floor(Math.log(num) / Math.log(1000)));
    return this.trimRightZeroes((num / Math.pow(1000, i)).toPrecision(4)) + sizes[i];
  }
 });
 //add to the registry
 WidgetRegistry["value"] = ValueAndSecondary;

 /**
  * Funnel widget
  */
var Funnel = React.createClass({
  colors: ["ff0000","ff3300","cc3300","cc6600","999900","669900","33cc00", "00cc00"],
  render: function(){
    var percentage = false, reverse = false, items = [];
    try {
      var o = JSON.parse(this.props.data);
      percentage = (o.percentage && o.percentage == "show");
      reverse = (o.type && o.type == "reverse");
      if(Array.isArray(o.item)){
        items = o.item;
      }
      if(!items.length){
        return <Error msg="Invalid Data (No Items)"/>;
      }
    }catch(e){
      return <Error msg="Invalid Data"/>;
    }
    var baseValue = reverse ? items[0].value : items[items.length-1].value;
    var colors = reverse ? this.colors.reverse() : this.colors;
    var rows = items.map(function(item, i){
      try{
        var p = 100 * item.value / baseValue;
        var label = [("label" in item) ? item.label : item.value];
        if (percentage) {
          label[1] = <small>{p.toFixed(2)+"%"}</small>;
        }
        var divStyle = {
          width: p.toFixed(2)+"%",
          background: "#"+colors[i]
        };
        return <tr>
          <td className="funnel-chart">
            <div className="funnel-value">{item.value.toFixed(2)}</div>
            <div style={divStyle} className="funnel-bar" />
          </td>
          <td className="funnel-label">{label}</td>
        </tr>;
      }catch(e){
        console.error(e);
      }
    });
    console.log(rows);
    return <table className="funnel-table">{rows}</table>
  }
})
WidgetRegistry["funnel"] = Funnel;

/**
 * The Highcharts widget.
 */
var HighChart = React.createClass({
  render: function(){
    var doc = ['<html><body><style>body{padding:0;margin:0;overflow:hidden}#container{width:100vw;height:100vh;}</style><div id="container"></div>',
        '<script src="http://code.highcharts.com/adapters/standalone-framework.js"></','script>',
        '<script src="http://code.highcharts.com/highcharts.js"></', 'script>',
        '<script src="http://code.highcharts.com/modules/exporting.js"></','script>',
        '<script>var data = ', this.props.data, ';',
        'data.chart = data.chart||{};',
        'data.chart.renderTo = "container";',
        'data.xAxis = data.xAxis||{}; data.xAxis.labels = data.xAxis.labels||{}; data.xAxis.labels.staggerLines = 1;',
        'var chart = new Highcharts.Chart(data);',
        '</', 'script></body></html>'].join("");
    return <iframe srcDoc={doc} seamless="seamless" sandbox="allow-scripts" />;
  }
});
WidgetRegistry["highchart"] = HighChart;

/**
 * The Gauge widget.
 * Interesting use of state and props as the render creates dom, but never
 * changes, only the canvas is re-drawn.
 */
var Gauge = React.createClass({
  componentDidMount: function() {
    var canvas = this.refs["arc"].getDOMNode();
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
      console.log("GAUGE:", min, max, value, label, canvas.height);
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
        color = p < 0.5 ? 'red' : 'green';

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle, counterClockwise);
      ctx.lineWidth = thick;
      ctx.strokeStyle = 'black';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endPercent, counterClockwise);
      ctx.lineWidth = thick
      ctx.strokeStyle = color;
      ctx.stroke();
    });
  },
  getData: function(cb) {
    var min = 0, max = 100, value, label;
    try{
      var jsdata = JSON.parse(this.props.data);
      if(! ("value" in jsdata)){
         return cb(<Error msg="No Value in Data"/>);
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
      console.error(e);
      return cb(<Error msg="Invalid Data"/>);
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
    if(error != null){
      return error;
    }
    return <div className="gauge-wrap">
      <canvas className="gauge-canvas" ref="arc"></canvas>
      <h1 className={"gauge-label gauge-"+style}>{label}</h1>
    </div>;
  }
});
WidgetRegistry["gauge"] = Gauge;
