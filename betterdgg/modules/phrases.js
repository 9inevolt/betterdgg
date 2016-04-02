(function(bdgg) {
    bdgg.phrases = (function() {

        var PHRASES = [ 
            //old phrases
            /(^|\b)BAR($|\b)/, 
            /.*?twitter\.com\/antibullyranger.*?/,

            //from addmute or addban
            /used my safeword/,
            /just can't nod and smile/,
            /(^|\s)momo\s.*\sbanned($|\s)|(^|\s)momo banned($|\s)/,
            /([\s\S]+?)?play([\s\S]+?)?undertale([\s\S]+?)?/,
            /([\s\S]+?)?dest[il]ny([\s\S]+?)?underta[il]e([\s\S]+?)?/,
            /!logs Eschkapade/,
            /\/scyx/,
            /卐/,
            /\/r\/bliutwo/,
            /\/ScYx17/,

            //links
            /puu\.sh\/iHbP6/, //knock knock
            /OSCiMbMVDLI/, //wake me up
            /SUdVyW0tcSo/, //wake me up
            /dQw4w9WgXcQ/, //rick
            /puu\.sh\/k0Hki\.jpg/, //knock knock
            /twitter\.com\/steven__bonnell/,
            /twitter\.com\/Sc2Destiny/,
            /tinyurl\.com/,

            //for debugging
            /(^|\b)JUSTATESTSTRINGNOONEUSES($|\b)/
        ];

        function _checkMessage(phrases, line) {

            for (var i = 0; i < phrases.length; i++) {
                var phraseMatches = line.match(phrases[i]);
                if (phraseMatches){
                    return phrases[i]; //return whatever the message matched so we can give feedback
                }
            }

            //no match found, message seems good.
            return false;
        }

        return {
            init: function() {

                var fnSendCommand = destiny.chat.gui.send;
                destiny.chat.gui.send = function() {

                    if (bdgg.settings.get('bdgg_prohibited_phrase_filter')){
                        var message = destiny.chat.gui.input.val();
                        var blackListMatch = _checkMessage(PHRASES, message);
                        //If the content of the chat input box matches any prohibited phrase, do not call the send function.
                        if (blackListMatch) {
                            var errorMessage = new ChatErrorMessage("BBDGG prevented your message from being sent because it matched the following prohibited phrase: " + blackListMatch.toString());
                            destiny.chat.gui.push(errorMessage);
                            return;
                        }
                    }

                    return fnSendCommand.apply(this);
                };
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
