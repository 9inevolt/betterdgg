const winUtils = require("sdk/window/utils");
const { ToggleButton } = require("sdk/ui/button/toggle");
const windowListener = require("./window-listener.js");

var button = ToggleButton({
    id: "sidebar_toggle_button",
    label: "Sidebar",
    icon: "./icon.png",
    onChange: function(state) {
        if (state.checked) {
            windowListener.loadIntoWindow(winUtils.getMostRecentBrowserWindow());
        } else {
            windowListener.unloadFromWindow(winUtils.getMostRecentBrowserWindow());
        }
    }
});
