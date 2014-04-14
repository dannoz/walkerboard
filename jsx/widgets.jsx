/** @jsx React.DOM */
/**
 * the Widget React Component, is more of a "Maybe", in case the
 * type doesn't exist
 */
var Widget = React.createClass({
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