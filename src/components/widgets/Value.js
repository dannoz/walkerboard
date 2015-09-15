import React from "react";
import PanelError from "../PanelError";
import cx from "classnames";

const InvalidData = <PanelError msg="Invalid Data" />;

export default React.createClass({
    displayName: "ValueWidget",
    render: function() {
        const data = this.props.data;
        console.log(data);
        if (typeof data === "string" || !("value" in data)) {
            //bad. it should be an object with a value prop.
            return InvalidData;
        }
        if (!(typeof data.value === "number")) {
            return InvalidData;
        }

        let secondary;
        const secondaryClass = {
            sub: true
        };
        if (typeof data.secondary === "number") {
            secondary = 100 * data.value / data.secondary;
            secondaryClass["sub-down"] = secondary < 100;
            secondaryClass["sub-up"] = secondary > 100;
            secondary = secondary.toFixed(2) + "%";
        } else if (typeof data.secondary === "string") {
            secondary = data.secondary;
        }
        return <div>
            <h1 className="main">{formatNumber(data.value)}</h1>
            {secondary && <h2 className={cx(secondaryClass)}>{secondary}</h2>}
        </div>;
    }
});

function trimRightZeroes(s) {
    //don't trim non-decimal places.
    if (s.indexOf(".") < 0) {
        return s;
    }
    while (s[s.length - 1] === "0") {
        s = s.substring(0, s.length - 1);
    }
    //remove the dot. if there is one
    if (s[s.length - 1] === ".") {
        s = s.substring(0, s.length - 1);
    }
    return s;
}

function formatNumber(num) {
    if (typeof num === "string") {
        try {
            num = parseInt(num, 10);
        } catch (e) {
            num = 0;
        }
    }
    var sizes = ["", "K", "M"];
    if (num === 0) {
        return "0";
    }
    var i = parseInt(Math.floor(Math.log(num) / Math.log(1000)), 10);
    return trimRightZeroes((num / Math.pow(1000, i)).toPrecision(4)) + sizes[i];
}
