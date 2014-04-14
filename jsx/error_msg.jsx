/** @jsx React.DOM */
//Error messages broken out for ease to change
var ErrorMsg = React.createClass({
  render: function(){
    return <h2 className="error">
      <span className="label label-danger">{this.props.msg}</span>
    </h2>;
  }
});