/** @jsx React.DOM */
var React = require("react");
//Error messages broken out for ease to change
module.exports = React.createClass({
  displayName: "ErrorMsg",
  render: function(){
    return <h2 className="error">
      <span className="label label-danger">{this.props.msg}</span>
    </h2>;
  }
});