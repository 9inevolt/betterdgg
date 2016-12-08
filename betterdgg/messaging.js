import _get from 'lodash.get';
import shortid from 'shortid';

const REQUEST = 'msgRequest';
const REPLY = 'msgReply';
const RESOLVED = 'msgResolved';
const REJECTED = 'msgRejected';

/**
 * Send a message from page script to the content script
 * To be used with {@link handleMessage} in the content script
 *
 * @param {string} msgType Key for the type of message to send
 * @param {Object} msg The message
 * @return {Promise} Resolved with the reply to the message
 *     or rejected with an error reply or timeout after ten seconds
 */
export function postMessage(msgType, msg) {
    const msgId = shortid.generate();

    return new Promise((resolve, reject) => {
        let listener = window.addEventListener('message', e => {
            if (window !== e.source
                    || _get(e.data, 'msgOp') !== REPLY
                    || _get(e.data, 'msgId') !== msgId) {
                return;
            }

            window.removeEventListener('message', listener);
            (_get(e.data, 'msgResolution') !== REJECTED ? resolve : reject)(_get(e.data, 'msg'));
        });

        window.postMessage({msg, msgId, msgType, msgOp: REQUEST}, '*');

        setTimeout(() => {
            window.removeEventListener('message', listener);
            reject('Timed out');
        }, 10000);
    });
}

/**
 * Handle messages from the page script in the content script
 * To be used with {@link postMessage} in the page script
 *
 * @param {string} msgType Key for the type of messages to handle
 * @param {function(Object)} handle Handler for the messages that can return
 *     the reply or a Promise
 */
export function handleMessage(msgType, handle) {
    window.addEventListener('message', e => {
        if (window !== e.source
                || _get(e.data, 'msgOp') !== REQUEST
                || _get(e.data, 'msgType') !== msgType) {
            return;
        }

        let msgId = e.data.msgId;

        Promise.resolve(handle(_get(e.data, 'msg')))
            .then(msg => {
                window.postMessage({msg, msgId, msgOp: REPLY}, '*');
            })
            .catch(err => {
                window.postMessage({msg: err, msgId, msgOp: REPLY, msgResolution: REJECTED}, '*');
            });
    });
}

/**
 * Send a message from content script to the background page
 * To be used with {@link onMessage} in the background page
 *
 * @param {string} msgType Key for the type of message to send
 * @param {Object} msg The message
 * @return {Promise} Resolved with the reply to the message
 *     or rejected with an error reply or timeout after ten seconds
 */
export function sendMessage(msgType, msg) {
    const msgId = shortid.generate();

    return new Promise((resolve, reject) => {
        function sendResponse(response) {
            if (_get(response, 'msgOp') !== REPLY || _get(response, 'msgId') !== msgId) {
                reject(response);
            } else {
                (_get(response, 'msgResolution') !== REJECTED ? resolve : reject)(_get(response, 'msg'));
            }
        }

        chrome.runtime.sendMessage({msg, msgId, msgType, msgOp: REQUEST}, sendResponse);

        setTimeout(() => {
            reject('Timed out');
        }, 10000);
    });
}
