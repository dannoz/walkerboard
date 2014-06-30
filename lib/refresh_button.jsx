/** @jsx React.DOM */
var React = require("react");
/**
 * The Little Refresh button...
 */
module.exports = React.createClass({
  displayName: "RefreshButton",
  render: function(){
    var divAttrs = {
      className: "refresh refresh-loading",
      title: this.props.title
    },
    spanClass = "glyphicon glyphicon-refresh";
    if(this.props.loading){
      spanClass += " rotate";
    }else{
      divAttrs.onClick = this.props.onClick;
    }
    return React.DOM.div(divAttrs, <span className={spanClass} />);
  }
});