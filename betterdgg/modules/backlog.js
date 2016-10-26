let fnDispatchBacklog;

let backlog = {
    init: function() {
        // Workaround so your own messages are displayed in the new backlog as well,
        // which they aren't otherwise for unknown reasons (might be some conflict with resolveMessage in gui.js).
        destiny.chat.gui.userMessages = [];

        // Remove the backlog
        destiny.chat.gui.lines.children(':has(>hr)').prevAll().remove();

        // Now load the backlog on a slight delay
        setTimeout(() => {
            destiny.chat.gui.loadBacklog();
        }, 1000);
    }
};

export default backlog
