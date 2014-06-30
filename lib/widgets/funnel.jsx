/** @jsx React.DOM */
var React = require("react"),
    WidgetRegistry = require("lib/widget_registry");
/**
 * Funnel widget
 */
WidgetRegistry.add("funnel", React.createClass({
  displayName: "Funnel",
  colors: ["ff0000","ff3300","cc3300","cc6600","999900","669900","33cc00", "00cc00"],
  render: function(){
    var percentage = false, reverse = false, items = [];
    try {
      var o = JSON.parse(this.props.data);
      percentage = (o.percentage && o.percentage == "show");
      reverse = (o.type && o.type == "reverse");
      if(Array.isArray(o.item)){
        items = o.item;
      }
      if(!items.length){
        return <Error msg="Invalid Data (No Items)"/>;
      }
    }catch(e){
      return <Error msg="Invalid Data"/>;
    }
    var baseValue = reverse ? items[0].value : items[items.length-1].value;
    var colors = reverse ? this.colors.reverse() : this.colors;
    var rows = items.map(function(item, i){
      try{
        var p = 100 * item.value / baseValue;
        var label = [("label" in item) ? item.label : item.value];
        if (percentage) {
          label[1] = <small>{p.toFixed(2)+"%"}</small>;
        }
        var divStyle = {
          width: p.toFixed(2)+"%",
          background: "#"+colors[i]
        };
        return <tr>
          <td className="funnel-chart">
            <div className="funnel-value">{item.value.toFixed(2)}</div>
            <div style={divStyle} className="funnel-bar" />
          </td>
          <td className="funnel-label">{label}</td>
        </tr>;
      }catch(e){
        console.error("funnel error:", e);
      }
    });
    return <table className="funnel-table">{rows}</table>;
  }
}));