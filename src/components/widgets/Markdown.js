import React from "react";
import marked from "marked";

require("./Markdown.scss");

export default React.createClass({
    displayName: "MarkdownWidget",
    render: function() {
        //we allow text OR and object like { markdown: "..." }
        let data = this.props.data;
        if (typeof data === "object" && "markdown" in data) {
            data = data.markdown;
        }
        return <div dangerouslySetInnerHTML={{ __html: marked(data) }}/>;
    }
});
