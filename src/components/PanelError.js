import React from "react";

export default React.createClass({
    displayName: "PanelError",
    render() {
        return <div>
            <h1>PanelError</h1>
            <pre>{this.props.msg}</pre>
        </div>;
    }
});
