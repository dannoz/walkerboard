/** @jsx React.DOM */
/**
 * The Little Refresh button...
 */
var RefreshButton = React.createClass({
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