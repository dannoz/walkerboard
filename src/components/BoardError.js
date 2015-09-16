import React from "react";
import Credit from "./Credit";
import { isOurError } from "../lib/util";

require("./BoardError.scss");

export default React.createClass({
    displayName: "BoardError",
    render() {
        const shouldShowError = process.env.NODE_ENV !== "production" || isOurError(this.props.error);
        const errorToShow = process.env.NODE_ENV !== "production" ? this.props.error.stack : this.props.error.message;
        return <div className="board-error">
            <h1>Error loading dashboard</h1>
            <h3>trying to load: <code>{this.props.url}</code></h3>
            <p><button className="btn btn-primary btn-lg">try another url?</button> <button className="btn btn-default btn-lg" onClick={() => window.location.reload()}>reload?</button></p>
            {shouldShowError && <pre>{errorToShow}</pre>}
            <p><Credit /></p>
        </div>;
    }
});
