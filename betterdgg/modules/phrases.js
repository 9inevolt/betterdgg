import settings from './settings';

var PHRASES = [];

function _checkMessage(phrases, line) {
    for (var i = 0; i < phrases.length; i++) {
        var phraseMatches = line.match(phrases[i]);
        if (phraseMatches) {
            return phrases[i]; //return whatever the message matched so we can give feedback
        }
    }
    //no match found, message seems good.
    return false;
}

var _enabled = false;

let phrases = {
    init: function() {
        _enabled = settings.get('bdgg_prohibited_phrase_filter');
        settings.on('bdgg_prohibited_phrase_filter', value => { _enabled = value; });

        var listner = function(e) {
            if (window !== e.source) {
                return;
            }

            if (e.data.type === 'bdgg_phrase_reply') {
                PHRASES = e.data.response.phrases;
            }
            else if (e.data.type === 'bdgg_phrase_error') {
                destiny.chat.gui.push(new ChatErrorMessage("BBDGG could not load the prohibited phrases list"));
            }
        };

        window.addEventListener('message', listner);
        window.postMessage({type: 'bdgg_phrase_request'}, '*');

        var fnSendCommand = destiny.chat.gui.send;
        destiny.chat.gui.send = function() {
            if (_enabled) {
                var message = destiny.chat.gui.input.val();
                //If the message starts with any prefix that would make it a private message, do not check for prohibited phrases.
                var isPublicMessage = (message.match(/^\s*\/(?:m(?:essage|sg)|w(?:hisper)?|t(?:ell)?|notify)/i) === null);

                if (isPublicMessage) {
                    var blackListMatch = _checkMessage(PHRASES, message);
                    //If the content of the chat input box matches any prohibited phrase, do not call the send function.
                    if (blackListMatch) {
                        blackListMatch = blackListMatch.replace(/<\/?[^>]+(>|$)/g, "");
                        var errorMessage = new ChatErrorMessage("BBDGG prevented your message from being sent because it matched the following prohibited phrase: " + blackListMatch.toString());
                        destiny.chat.gui.push(errorMessage);
                        return;
                    }
                }
            }

            return fnSendCommand.apply(this, arguments);
        };
    }
};

export default phrases;
