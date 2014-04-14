/** @jsx React.DOM */
/**
 * Board is just a collection of panels.
 */
var Board = React.createClass({
  render: function(){
    return <div>{this.props.Panels.map(function(p){
      return Panel(p);
    })}</div>;
  }
});