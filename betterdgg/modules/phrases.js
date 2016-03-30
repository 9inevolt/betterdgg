(function(bdgg) {
    bdgg.phrases = (function() {

        var PHRASES = [ 
            /(^|\b)BAR($|\b)/, 
            /(^|\b)JUSTATEST($|\b)/
        ];

        function _testPhrase(phrases, line) {

            var abort = false;

            for (var i = 0; i < phrases.length; i++) {
                phraseMatches = line.match(phrases[i]);
                if (phraseMatches){
                        abort = true;
                }
            }

            return abort;
        }
    
        return {
            init: function() {

                var fnSendCommand = destiny.chat.gui.send;
                destiny.chat.gui.send = function() {

                    if (bdgg.settings.get('bdgg_prohibited_phrase_filter')){
                        var msg = destiny.chat.gui.input.val()
                        //If the content of the chat input box matches any prohibited phrase, do not call the send function.
                        if (_testPhrase(PHRASES, msg)) {
                            return;
                        }
                    }

                    return fnSendCommand.apply(this);
                };
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
