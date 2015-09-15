import React from "react";
import Widgets from "./Widgets";
import PanelError from "./PanelError";
import cx from "classnames";
import Loading from "./Loading";

//webpack require css
require("./Panel.scss");


export default React.createClass({
    displayName: "Panel",
    render() {
        const def = this.props.definition;
        const Widget = Widgets.get(def.Type);
        const panelClass = cx({
            panel: true,
            [`panel-x-${def.X}`]: true,
            [`panel-y-${def.Y}`]: true,
            [`panel-w-${def.W}`]: true,
            [`panel-h-${def.H}`]: true,
            [`panel-type-${def.Type}`]: true
        });

        return <div className={panelClass}>
            <div className="panel-heading">
                {def.Title}
                <div className="refresh refresh-loading" onClick={this.props.onRefresh}><span className={cx({ glyphicon: true, "glyphicon-refresh": true, rotate: this.props.data.when({ pending: () => true }) })} /></div>
            </div>
            <div className="panel-body">
                {this.props.data.when({ //@TODO: save the last good data as always display that, overlaying any loading/error
                    pending: () => <Loading />,
                    error: err => <PanelError error={err} />,
                    ok: data => <Widget data={data} />
                })}
            </div>
        </div>;
    },
    shouldComponentUpdate(nextProps) {
        //if the data changes, we re-render.
        return this.props.data !== nextProps.data;
    }
});
