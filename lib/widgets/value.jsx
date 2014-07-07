/** @jsx React.DOM */
var React = require("react"),
    ErrorMsg = require("lib/error_msg"),
    WidgetRegistry = require("lib/widget_registry");
/**
 * ValueAndSecondary widget.
 */
WidgetRegistry.add("value", React.createClass({
  displayName: "ValueAndSecondary",
  render: function(){
    var main = "", sub = 0, jsdata;
    try{
      jsdata = JSON.parse(this.props.data);
      main = jsdata.item[0].value;
    }catch(e){
      console.error(e);
      console.log(this.props);
      return <ErrorMsg msg="Invalid Data"/>;
    }
    try {
      sub = (100 * main / jsdata.item[1].value);
    }catch(e){
      sub = false;
    }
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
    if(typeof(num) === "string"){
      try {
        num = parseInt(num, 10);
      }catch(e){
        num = 0;
      }
    }
    var sizes = ["","K","M"];
    if (num === 0) { return "0"; }
    var i = parseInt(Math.floor(Math.log(num) / Math.log(1000)));
    return this.trimRightZeroes((num / Math.pow(1000, i)).toPrecision(4)) + sizes[i];
  }
}));