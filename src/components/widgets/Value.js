import React from "react";
import PanelError from "../PanelError";
import cx from "classnames";

//webpack require the css
require("./Value.scss");

const InvalidData = <PanelError msg="Invalid Data" />;

export default React.createClass({
    displayName: "ValueWidget",
    render: function() {
        const data = this.props.data;
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
            let icon;
            switch (true) {
            case secondary < 100:
                secondaryClass["sub-down"] = true;
                icon = <span className="glyphicon glyphicon-triangle-bottom" />;
                break;
            case secondary > 100:
                secondaryClass["sub-up"] = true;
                icon = <span className="glyphicon glyphicon-triangle-top" />;
                break;
            default:
                // no default
            }
            secondary = <div className={cx(secondaryClass)}>{secondary.toFixed(2) + "%"}{icon}</div>;
        } else if (typeof data.secondary === "string") {
            secondary = <div className={cx(secondaryClass)}>{data.secondary}</div>;
        }
        const mainClass = {
            main: true,
            "no-sub": !secondary
        };
        return <div>
            <div className={cx(mainClass)}>{formatNumber(data.value)}</div>
            {secondary}
        </div>;
    },
    statics: require("./Value.demo")
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
