
// bdgg-ify the chat backlog. The backlog is loaded before the addon is ready and thus has to be modified retroactively.

(function(bdgg) {
    bdgg.backlog = (function() {
        return {
            init: function() {

                // This flag is set by the original chat once the backlog parsing is done,
                // and should always be set once we arrive here, but we check it just to be sure.               
                if (!destiny.chat.gui.backlogLoading){

                    // Workaround so your own messages are displayed in the new backlog as well,
                    // which they aren't otherwise for unknown reasons (might be some conflict with resolveMessage in gui.js).
                    destiny.chat.gui.userMessages = [];

                    // Remove the vanilla backlog and add backlog again, now that the bbdgg-formatters etc. in place
                    while (destiny.chat.gui.lines[0].hasChildNodes())
                        destiny.chat.gui.lines[0].removeChild(destiny.chat.gui.lines[0].lastChild);

                    for (var i = 0; i < destiny.chat.gui.backlog.length; i++)
                        destiny.chat.dispatchBacklog(destiny.chat.gui.backlog[i]);

                }
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
