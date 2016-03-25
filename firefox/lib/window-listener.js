const data = require("sdk/self").data;
const styleUtils = require("sdk/stylesheet/utils");
const winUtils = require("sdk/window/utils");

const { Worker } = require("sdk/content/worker");
const { emit } = require('sdk/event/core');
const { pipe } = require('sdk/event/utils');

const { Cc, Ci } = require("chrome");
const wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);

const { pagemod, workerAttached } = require("./service");

const windowListener = {
    onOpenWindow: function (aXULWindow) {
        // Wait for the window to finish loading
        const aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
        aDOMWindow.addEventListener("load", function () {
            aDOMWindow.removeEventListener("load", arguments.callee, false);
            windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
        }, false);
    },
    onCloseWindow: function (aXULWindow) {},
    onWindowTitleChange: function (aXULWindow, aNewTitle) {},
    register: function () {
        // Load into any existing windows
        const XULWindows = wm.getXULWindowEnumerator(null);
        while (XULWindows.hasMoreElements()) {
            const aXULWindow = XULWindows.getNext();
            const aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
            windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
        }

        // Listen to new windows
        wm.addListener(windowListener);
    },
    unregister: function () {
        // Unload from any existing windows
        const XULWindows = wm.getXULWindowEnumerator(null);
        while (XULWindows.hasMoreElements()) {
            const aXULWindow = XULWindows.getNext();
            const aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
            windowListener.unloadFromWindow(aDOMWindow, aXULWindow);
        }

        //Stop listening so future added windows dont get this attached
        wm.removeListener(windowListener);
    },
    loadIntoWindow: function (aDOMWindow, aXULWindow) {
        if (!aDOMWindow) {
            return;
        }

        if (!aXULWindow) {
            aXULWindow = winUtils.getXULWindow(aDOMWindow);
        }

        const browser = aDOMWindow.document.querySelector('#browser');
        if (browser) {
            const splitter = aDOMWindow.document.createElement('splitter');
            let propsToSet = {
                id: 'demo-sidebar-with-html_splitter'
            };
            for (var p in propsToSet) {
                splitter.setAttribute(p, propsToSet[p]);
            }

            const sidebar = aDOMWindow.document.createElement('vbox');
            propsToSet = {
                id: 'demo-sidebar-with-html_sidebar'
            };
            for (p in propsToSet) {
                sidebar.setAttribute(p, propsToSet[p]);
            }

            const sidebarBrowser = aDOMWindow.document.createElement('browser');
            propsToSet = {
                id: 'sidebar_chat',
                type: 'content',
                context: 'contentAreaContextMenu',
                disableglobalhistory: 'true',
                tooltip: 'aHTMLTooltip',
                mousethrough: 'never',
                flex: '1',
                style: 'min-width: 20em; width: 400px;',
                src: 'http://www.destiny.gg/embed/chat'
            };
            for (p in propsToSet) {
                sidebarBrowser.setAttribute(p, propsToSet[p]);
            }

            sidebarBrowser.addEventListener('DOMWindowCreated', function() {
                const sidebarWindow = sidebarBrowser.contentWindow;
                sidebarWindow.addEventListener('load', function () {
                    sidebarWindow.removeEventListener('load', arguments.callee, true);
                    styleUtils.loadSheet(sidebarWindow, data.url('betterdgg.css'));
                    const worker = Worker({
                        window: sidebarWindow,
                        contentScript: pagemod.contentScript,
                        contentScriptFile: pagemod.contentScriptFile,
                        contentScriptOptions: pagemod.contentScriptOptions,
                        // Bug 980468: Syntax errors from scripts can happen
                        // before the worker can set up an error handler. They
                        // are per-mod rather than per-worker so are best
                        // handled at the mod level.
                        onError: (e) => emit(pagemod, 'error', e)
                    });
                    pipe(worker, pagemod);
                    workerAttached(worker);
                }, true);
            }, true);

            browser.appendChild(splitter);
            sidebar.appendChild(sidebarBrowser);
            browser.appendChild(sidebar);
        }
    },
    unloadFromWindow: function (aDOMWindow, aXULWindow) {
        if (!aDOMWindow) {
            return;
        }

        if (!aXULWindow) {
            aXULWindow = winUtils.getXULWindow(aDOMWindow);
        }

        const splitter = aDOMWindow.document.querySelector('#demo-sidebar-with-html_splitter');

        if (splitter) {
            const sidebar = aDOMWindow.document.querySelector('#demo-sidebar-with-html_sidebar');
            splitter.parentNode.removeChild(splitter);
            sidebar.parentNode.removeChild(sidebar);
        }
    }
};

module.exports = windowListener;
