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
        const Widget = Widgets.get(def.type);
        const panelClass = cx({
            widget: true,
            panel: !def.transparent,
            [`widget-x-${def.x}`]: true,
            [`widget-y-${def.y}`]: true,
            [`widget-w-${def.w}`]: true,
            [`widget-h-${def.h}`]: true,
            [`widget-type-${def.type}`]: true
        });

        return <div className={panelClass}>
            {def.title && <div className="widget-heading panel-heading">def.title</div>}
            <div className="widget-body">
                {this.props.data.when({ //@TODO: save the last good data as always display that, overlaying any loading/error
                    pending: () => <Loading />,
                    error: err => <PanelError error={err} />,
                    ok: data => <Widget data={data} size={def.innerSize} />
                })}
            </div>
            {def.url && <div className="widget-refresh widget-refresh-loading" onClick={this.props.onRefresh}><span className={cx({ glyphicon: true, "glyphicon-refresh": true, "widget-rotate": this.props.data.when({ pending: () => true }) })} /></div>}
        </div>;
    },
    shouldComponentUpdate(nextProps) {
        //if the data changes, we re-render.
        return this.props.data !== nextProps.data;
    }
});
