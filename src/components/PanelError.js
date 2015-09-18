import React from "react";

export default React.createClass({
    displayName: "PanelError",
    render() {
        return <div style={{textAlign: "center"}}>
            <h1><span className="glyphicon glyphicon-exclamation-sign" /></h1>
            <p>{this.props.msg}</p>
        </div>;
    }
});
