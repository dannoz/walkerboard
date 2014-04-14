/** @jsx React.DOM */
/**
 * The Highcharts widget.
 */
WidgetRegistry.add("highchart", React.createClass({
  displayName: "HighChart",
  render: function(){
    var doc = ['<html><body><style>body{padding:0;margin:0;overflow:hidden}#container{width:100vw;height:100vh;}</style><div id="container"></div>',
        '<script src="http://code.highcharts.com/adapters/standalone-framework.js"></','script>',
        '<script src="http://code.highcharts.com/highcharts.js"></', 'script>',
        '<script src="http://code.highcharts.com/modules/exporting.js"></','script>',
        '<script>var data = ', this.props.data, ';',
        'data.chart = data.chart||{};',
        'data.chart.renderTo = "container";',
        'data.xAxis = data.xAxis||{}; data.xAxis.labels = data.xAxis.labels||{}; data.xAxis.labels.staggerLines = 1;',
        'var chart = new Highcharts.Chart(data);',
        '</', 'script></body></html>'].join("");
    return <iframe srcDoc={doc} seamless="seamless" sandbox="allow-scripts" />;
  }
}));