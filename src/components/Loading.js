import React from "react";

require("./Loading.scss");

export default React.createClass({
    displayName: "Loading",
    render() {
        return <div>
            <div className="loading">
                <div className="loading-circle loading-circle-horizontal" />
                <div className="loading-circle loading-circle-vertical" />
            </div>
            <div className="loading-content">{this.props.children}</div>
        </div>;
    }
});
