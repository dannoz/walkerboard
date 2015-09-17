/**
 * Widgets is a Registry of components. They need to be imported here.
 * OR forceably included by webpack.
 */
import Value from "./widgets/Value";
import Funnel from "./widgets/Funnel";
import Gauge from "./widgets/Gauge";
import HighChart from "./widgets/HighChart";
import ChartJS from "./widgets/ChartJS";
import Text from "./widgets/Text";
import Markdown from "./widgets/Markdown";

const Widgets = new Map();
export default Widgets;

//this could be more dynamic... but how would webpack know?
Widgets.set("value", Value);
Widgets.set("funnel", Funnel);
Widgets.set("gauge", Gauge);
Widgets.set("highchart", HighChart);
Widgets.set("chartjs", ChartJS);
Widgets.set("text", Text);
Widgets.set("markdown", Markdown);
