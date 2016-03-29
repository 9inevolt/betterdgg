(function(bdgg) {
    bdgg.help = (function() {
        return {
            init: function() {
                // hook into help command
                var fnHandleCommand = destiny.chat.handleCommand;
                destiny.chat.handleCommand = function(str) {
                    fnHandleCommand.apply(this, arguments);
                    if (/^help ?/.test(str)) {
                        this.gui.push(new ChatInfoMessage("Better Destiny.gg: "
                            + "/stalk /strims /ps /passivestalk (Without arguments to list stalked users)"));
                    }
                };
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
