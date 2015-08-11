const winUtils = require("sdk/window/utils");
const { ToggleButton } = require("sdk/ui/button/toggle");
const windowListener = require("./window-listener.js");

const { Cc, Ci, components } = require("chrome");
//var instance = Cc["@mozilla.org/moz/jssubscript-loader;1"];
//var loader = instance.getService(Ci.mozIJSSubScriptLoader);
//function loadScript(url) {
//    loader.loadSubScript(url);
//}
//
//loadScript('resource://betterdgg-at-destiny-dot-gg/betterdgg/lib/jsbn.js');
//require('./jsbn.js');

function loadScript(name, context) {
    // Create the Sandbox
    let sandbox = components.utils.Sandbox(context, {
        sandboxPrototype: context,
        wantXrays: false
    });

    // Get the caller's filename
    let file = components.caller.stack.filename;
    // Strip off any prefixes added by the sub-script loader
    // and the trailing filename
    let directory = file.replace(/.* -> |[^\/]+$/g, "");

    Services.scriptloader.loadSubScript(directory + name,
                                        sandbox, "UTF-8");
}

loadScript("jsbn.js", this);

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
