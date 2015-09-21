const output = {
    branding: {
        text: "WalkerBoard Test Dashboard"
    }
};

//so we need one of each widget.
import widgets from "../src/components/Widgets";
//import vars from "../src/lib/sizing";
import Packer from "../src/lib/packer";

// const MAX_WIDTH = vars.maxUnitsWide;
// const MAX_HEIGHT = vars.maxUnitsTall;

function createAllSizePanels(panelDef) {
    //try and fit it onto a box 12 wide
    const packer = new Packer({ w: 16 });
    //create in size order, widest, shortest,
    // //this is all sizes.
    // const sizes = [];
    // for (let w = MAX_WIDTH; w > 0; w--) {
    //      for (let h = 1; h <= MAX_HEIGHT; h++) {
    //          sizes.push({ w, h });
    //      }
    // }

    //this is just reasonable ones...
    // order here is important for the packer...
    const sizes = [
        [2, 2],
        [4, 2],
        [2, 1],
        [4, 4],
        [6, 4],
        [8, 4],
        [6, 6],
        [8, 6]
    ]
    .map(([w, h]) => ({ w, h }));

    let blocks = sizes
        .map(size => Object.assign(size, panelDef));

    if (panelDef.title) {
        blocks = blocks.map(block => {
            block.title = `${block.title} ${block.w}x${block.h}`;
            return block;
        });
    }

    packer.fit(blocks);
    return blocks.map(block => {
        if (block.fit) {
            block.x = block.fit.x;
            block.y = block.fit.y;
            delete block.fit;
            return block;
        }
    }).filter(Boolean);
}

const widgetToBoardReducer = (arr, [type, value]) => {
    if (typeof value.getDemoData === "function") {
        const demoData = value.getDemoData();
        demoData.forEach(([demo, data]) => {
            //with titles
            arr.push({
                title: `${value.displayName} Sizes (with titles, ${demo})`,
                panels: createAllSizePanels({ title: `${value.displayName}`, type, data })
            });
            //without titles
            arr.push({
                title: `${value.displayName} Sizes (no titles, ${demo})`,
                panels: createAllSizePanels({ type, data })
            });
        });
    }
    return arr;
};

output.boards = Array.from(widgets.entries()).reduce(widgetToBoardReducer, []).sort((a, b) => (b.title > a.title) ? 1 : -1);

//Now prepend the Intro board, and append the errors
output.boards.unshift({
    title: "Welcome to WalkerBoard",
    panels: [
        {
            type: "markdown",
            title: "/README.md",
            data: require("fs").readFileSync("./README.md", "utf8"),
            x: 0, y: 0,
            w: 4, h: 6
        }
    ]
});

console.log(JSON.stringify(output, null, "  "));
