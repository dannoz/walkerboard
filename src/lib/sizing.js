//webpack require for this special loader...
const sassVariables = require("!sass-variables!../style/base.scss");

const vars = Object.keys(sassVariables).reduce((acc, key) => {
    const int = parseInt(sassVariables[key], 10);
    if (!isNaN(int)) {
        acc[key] = int;
    }
    return acc;
}, {});

//cache these calculations
const sizeCache = new Map();

export function getWidgetPosition({ x, y }) {
    const cache = `pos:${x},${y}`;
    if (!sizeCache.has(cache)) {
        sizeCache.set(cache, {
            left: (vars.cellWidth + vars.cellGutter) * x,
            top: (vars.cellHeight + vars.cellGutter) * y
        });
    }
    return sizeCache.get(cache);
}

export function getWidgetBounds({ x, y, w, h }) {
    const { left, top } = getWidgetPosition({ x, y });
    return {
        x1: left, y1: top,
        x2: left + (vars.cellWidth + vars.cellGutter) * w,
        y2: top + (vars.cellHeight + vars.cellGutter) * h
    };
}

export function getWidgetInnerSize({ w, h, title = false }) {
    const hasTitle = title !== false;
    const cache = `size:${w}x${h}-${hasTitle}`;
    if (!sizeCache.has(cache)) {
        sizeCache.set(cache, {
            width: (vars.cellWidth + vars.cellGutter) * w - vars.cellGutter - (vars.widgetPadding * 2),
            height: (vars.cellHeight + vars.cellGutter) * h - vars.cellGutter - (vars.widgetPadding * 2) - (hasTitle ? vars.widgetHeaderSize : 0)
        });
    }
    return sizeCache.get(cache);
}

export function getDashboardSize(panels) {
    let size = { x1: 0, x2: 0, y1: 0, y2: 0 };
    if (panels.length > 0) {
        size = panels.reduce( (bounds, panel) => {
            const pos = getWidgetBounds(panel);
            bounds.x1 = Math.min(bounds.x1, pos.x1);
            bounds.y1 = Math.min(bounds.y1, pos.y1);
            bounds.x2 = Math.max(bounds.x2, pos.x2);
            bounds.y2 = Math.max(bounds.y2, pos.y2);
            return bounds;
        }, { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity });
    }
    return {
        width: size.x2 - size.x1,
        height: size.y2 - size.y1
    };
}


export default vars;
