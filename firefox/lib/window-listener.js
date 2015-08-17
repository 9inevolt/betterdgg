const data = require("sdk/self").data;
const styleUtils = require("sdk/stylesheet/utils");
//const events = require("sdk/system/events");
const winUtils = require("sdk/window/utils");

const { Worker } = require("sdk/content/worker");
const { on, emit, once } = require('sdk/event/core');
const { pipe } = require('sdk/event/utils');

const { Cc, Ci } = require("chrome");
const wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);

const { pagemod, workerAttached } = require("service");

var windowListener = {
    //DO NOT EDIT HERE
    onOpenWindow: function (aXULWindow) {
        // Wait for the window to finish loading
        let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
        aDOMWindow.addEventListener("load", function () {
            aDOMWindow.removeEventListener("load", arguments.callee, false);
            windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
        }, false);
    },
    onCloseWindow: function (aXULWindow) {},
    onWindowTitleChange: function (aXULWindow, aNewTitle) {},
    register: function () {
        // Load into any existing windows
        let XULWindows = wm.getXULWindowEnumerator(null);
        while (XULWindows.hasMoreElements()) {
            let aXULWindow = XULWindows.getNext();
            let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
            windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
        }
        // Listen to new windows
        wm.addListener(windowListener);
    },
    unregister: function () {
        // Unload from any existing windows
        let XULWindows = wm.getXULWindowEnumerator(null);
        while (XULWindows.hasMoreElements()) {
            let aXULWindow = XULWindows.getNext();
            let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
            windowListener.unloadFromWindow(aDOMWindow, aXULWindow);
        }
        //Stop listening so future added windows dont get this attached
        wm.removeListener(windowListener);
    },
    //END - DO NOT EDIT HERE
    loadIntoWindow: function (aDOMWindow, aXULWindow) {
        if (!aDOMWindow) {
            return;
        }

        if (!aXULWindow) {
            aXULWindow = winUtils.getXULWindow(aDOMWindow);
        }

        var browser = aDOMWindow.document.querySelector('#browser')
        if (browser) {
            var splitter = aDOMWindow.document.createElement('splitter');
            var propsToSet = {
                id: 'demo-sidebar-with-html_splitter',
                //class: 'sidebar-splitter' //im just copying what mozilla does for their social sidebar splitter //i left it out, but you can leave it in to see how you can style the splitter
            }
            for (var p in propsToSet) {
                splitter.setAttribute(p, propsToSet[p]);
            }

            var sidebar = aDOMWindow.document.createElement('vbox');
            var propsToSet = {
                id: 'demo-sidebar-with-html_sidebar',
                //persist: 'width' //mozilla uses persist width here, i dont know what it does and cant see it how makes a difference so i left it out
            }
            for (var p in propsToSet) {
                sidebar.setAttribute(p, propsToSet[p]);
            }

            var sidebarBrowser = aDOMWindow.document.createElement('browser');
            var propsToSet = {
                id: 'sidebar_chat',
                type: 'content',
                context: 'contentAreaContextMenu',
                disableglobalhistory: 'true',
                tooltip: 'aHTMLTooltip',
                mousethrough: 'never',
                flex: '1', //do not remove this
                style: 'min-width: 20em; width: 400px;',
                src: 'http://www.destiny.gg/embed/chat'
            }
            for (var p in propsToSet) {
                sidebarBrowser.setAttribute(p, propsToSet[p]);
            }

            sidebarBrowser.addEventListener('DOMWindowCreated', function() {
                var sidebarWindow = sidebarBrowser.contentWindow;
                sidebarWindow.addEventListener('load', function () {
                    sidebarWindow.removeEventListener('load', arguments.callee, true);
                    styleUtils.loadSheet(sidebarWindow, data.url('betterdgg.css'));
                    let worker = Worker({
                        window: sidebarWindow,
                        contentScript: pagemod.contentScript,
                        contentScriptFile: pagemod.contentScriptFile,
                        contentScriptOptions: pagemod.contentScriptOptions,
                        // Bug 980468: Syntax errors from scripts can happen before the worker
                        // can set up an error handler. They are per-mod rather than per-worker
                        // so are best handled at the mod level.
                        onError: (e) => emit(pagemod, 'error', e)
                    });
                    pipe(worker, pagemod);
                    workerAttached(worker);
                    // do we need these?
                    //emit(mod, 'attach', worker);
                    //once(worker, 'detach', function detach() {
                    //    worker.destroy();
                    //});

                    // won't work because page-mod is restricted to tabs
                    //events.emit('document-element-inserted', { subject: sidebarWindow.document });
                }, true);
            }, true);

            browser.appendChild(splitter);

            sidebar.appendChild(sidebarBrowser);
            browser.appendChild(sidebar);
        }
        //END - EDIT BELOW HERE
    },
    unloadFromWindow: function (aDOMWindow, aXULWindow) {
        if (!aDOMWindow) {
            return;
        }

        if (!aXULWindow) {
            aXULWindow = winUtils.getXULWindow(aDOMWindow);
        }

        var splitter = aDOMWindow.document.querySelector('#demo-sidebar-with-html_splitter');

        if (splitter) {
            var sidebar = aDOMWindow.document.querySelector('#demo-sidebar-with-html_sidebar');
            splitter.parentNode.removeChild(splitter);
            sidebar.parentNode.removeChild(sidebar);
        }
        //END - EDIT BELOW HERE
    }
};

module.exports = windowListener;
