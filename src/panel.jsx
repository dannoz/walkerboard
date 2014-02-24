/**
 * @jsx React.DOM
 */
/**
 * Board is just a collection of panels.
 */
var Board = React.createClass({
  render: function(){
    return <div>{this.props.Panels.map(function(p){
      return Panel(p);
    })}</div>
  }
});
/**
 * Panel Component
 *
 * The initial state of a panel component is "loading"
 * Then the data is loaded and the the Widget is rendered.
 * It auto refreshes by a given period and has a button to force refresh
 */
var Panel = React.createClass({
  getInitialState: function(){
    //here we return the "loading" state. the data is null, and the error is empty.
    //this can be shown to mean loading...
    return {
      data: null, //the data for the widget
      error: "", //if an error occured
      last: null //when we last loaded data
    };
  },
  refresh: function(){
    //re-get the data.
    this.setState(this.getInitialState());
    this.loadData();
  },
  loadData: function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", this.props.Url, true);
    xhr.addEventListener("load", function(){
      if(!this.isMounted()){ return; }
      if(xhr.status == 200) {
        this.setState({
          data: xhr.responseText,
          error: "",
          last: new Date()
        });
      }else{
        this.setState({
          data: null,
          error: "Could not fetch data",
          last: new Date
        });
      }
    }.bind(this));
    xhr.addEventListener("error", function(){
      this.setState({
        data: null,
        error: "Could not fetch data",
        last: new Date
      });
    }.bind(this));
    //setTimeout(function(){
    xhr.send(null);
    //}, 20000);
  },
  componentDidMount: function(){
    this.loadData();
    //start interval for state.
    if(this.state.interval){
      window.clearInterval(this.state.interval)
    }
    this.setState({ interval: window.setInterval(this.loadData, this.props.Update * 1000) });
  },
  componentWillUnmount: function(){
    if(this.state.interval){
      window.clearInterval(this.state.interval)
    }
  },
  formatDate: function(d){
    if(!d){ return ""; }
    return d.toTimeString().split(" ")[0];
  },
  render: function(){
    var body, loading = false
    if(this.state.error){
      //we are in an Error state.
      body = <Error msg={this.state.error} />;
    }else if(this.state.data){
      //we are loaded!
      body = <Widget which={this.props.Type} data={this.state.data}/>
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
          <RefreshButton loading={loading} onClick={this.refresh.bind(this)} title={"Last Update: "+this.formatDate(this.state.last)} />
        </div>
        <div className="panel-body">{body}</div>
      </div>
    );
  }
});

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