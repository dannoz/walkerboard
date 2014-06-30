/** @jsx React.DOM */
var React = require("react"),
    Panel = require("lib/panel");
/**
 * Board is just a collection of panels.
 */
module.exports = React.createClass({
  displayName: "Board",
  render: function(){
    var hub = this.props.hub, panels = hub.get("Panels") || [];
    return <div>{panels.map(function(p, i){
      var props = { hub: hub, key: i, idx: i};
      for(var prop in p){
        if(Object.prototype.hasOwnProperty.call(p, prop)){
          props[prop] = p[prop];
        }
      }
      return Panel(props);
    })}</div>;
  }
});