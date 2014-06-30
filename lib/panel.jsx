/** @jsx React.DOM */
/* jshint browser:true */
var React = require("react"),
    Widget = require("lib/widgets"),
    RefreshButton = require("lib/refresh_button"),
    ErrorMsg = require("lib/error_msg");
/**
 * Panel Component
 *
 * The initial state of a panel component is "loading"
 * Then the data is loaded and the the Widget is rendered.
 * It auto refreshes by a given period and has a button to force refresh
 */
module.exports = React.createClass({
  displayName: "Panel",
  refresh: function(){
    //re-get the data.
    this.props.hub.dispatch("force-update", this.props.idx);
  },
  componentDidMount: function(){
    this.props.hub.dispatch("moar-data-please", this.props.idx);
  },
  componentWillUnmount: function(){
    this.props.hub.dispatch("stop-data-please", this.props.idx);
  },
  formatDate: function(d){
    if(!d){ return "never"; }
    return (new Date(d)).toTimeString().split(" ")[0];
  },
  render: function(){
    var body, loading = false, status = this.props.Status || {};
    if(status.error){
      //we are in an Error state.
      body = <ErrorMsg msg={status.error} />;
    }else if(status.data){
      //we are loaded!
      body = <Widget which={this.props.Type} data={status.data}/>;
    }else{
      //we are loading.
      loading = true;
      body = <div className="panel-loading">Loading Widget</div>;
    }
    return (
      <div className={["panel panel-default",
            "panel-x-"+this.props.X,
            "panel-y-"+this.props.Y,
            "panel-w-"+this.props.W,
            "panel-h-"+this.props.H,
            this.props.Type].join(" ")}>
        <div className="panel-heading">
          {this.props.Title}
          <RefreshButton loading={loading} onClick={this.refresh} title={"Last Update: "+this.formatDate(status.last)} />
        </div>
        <div className="panel-body">{body}</div>
      </div>
    );
  }
});