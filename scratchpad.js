// Sample Firefox scratchpad to test BDGG in sidebar
// IMPORTANT: Must set scratchpad to Browser Context

// The sidebar must be visible
let w = document.getElementById("sidebar_chat").contentWindow;

/* Doesn't work
if (!w) {
    alert("This window is yet to be created");
} else {
    XPCOMUtils.defineLazyModuleGetter(this, "Toolbox",
      "resource:///modules/devtools/Toolbox.jsm");
    XPCOMUtils.defineLazyModuleGetter(this, "TargetFactory",
      "resource:///modules/devtools/Target.jsm");
    let target = TargetFactory.forWindow(w);
    let toolbox = gDevTools.getToolbox(target);
    toolbox ? toolbox.destroy() : gDevTools.showToolbox(target, undefined, "window");
}
*/

let bdgg = w.wrappedJSObject.BetterDGG;

//bdgg.test.chat.error()
//etc.

