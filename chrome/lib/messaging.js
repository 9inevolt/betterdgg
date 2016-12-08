import _get from 'lodash.get';

// TODO: should we share imports between content/background?
const REQUEST = 'msgRequest';
const REPLY = 'msgReply';
const RESOLVED = 'msgResolved';
const REJECTED = 'msgRejected';

/**
 * Handle messages from the content script in the background page
 * To be used with {@link sendMessage} in the content script
 *
 * @param {string} msgType Key for the type of messages to handle
 * @param {function(Object)} handle Handler for the messages that can return
 *     the reply or a Promise
 */
export function onMessage(msgType, handle) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (_get(msg, 'msgOp') !== REQUEST || _get(msg, 'msgType') !== msgType) {
            return;
        }

        let msgId = msg.msgId;

        Promise.resolve(handle(_get(msg, 'msg')))
            .then(reply => {
                sendResponse({msg: reply, msgId, msgOp: REPLY});
            })
            .catch(err => {
                sendResponse({msg: err, msgId, msgOp: REPLY, msgResolution: REJECTED});
            });

        return true;
    });
}
