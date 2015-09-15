import React from "react";

export default React.createClass({
    displayName: "BoardError",
    render() {
        return <div>
            <h1>BoardError</h1>
            <pre>{this.props.error.stack}</pre>
        </div>;
    }
});
