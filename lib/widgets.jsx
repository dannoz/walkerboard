/** @jsx React.DOM */
var React = require("react"),
    WidgetRegistry = require("lib/widget_registry"),
    ErrorMsg = require("lib/error_msg");
/**
 * the Widget React Component, is more of a "Maybe", in case the
 * type doesn't exist
 */
module.exports = React.createClass({
  displayName: "Widget",
  render: function(){
    //check for widget existence and render or error
    var widget = WidgetRegistry.get(this.props.which);
    if(widget === false){
      return <ErrorMsg msg={"Widget '"+this.props.which+"' not found."} />;
    }else{
      return widget({data: this.props.data});
    }
  }
});
