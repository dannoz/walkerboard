import React from "react";

require("./Text.scss");

export default React.createClass({
    displayName: "TextWidget",
    render: function() {
        //we allow text OR and object like { text: "..." }
        let data = this.props.data;
        if (typeof data === "object" && "text" in data) {
            data = data.text;
        }
        return <div>{"" + data}</div>;
    },
    statics: {
        getDemoData() {
            return [ [ "text", "hello world!" ] ];
        }
    }
});
