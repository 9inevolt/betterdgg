import { handleMessage, sendMessage } from '../messaging';

const port = chrome.runtime.connect();
port.onMessage.addListener(pushMessage);

function pushMessage(obj) {
    window.postMessage(obj, '*');
}

function passThrough(msgType) {
    handleMessage(msgType, data => {
        return sendMessage(msgType, data);
    });
}

passThrough('bdgg_stalk_request');
passThrough('bdgg_flair_update');
passThrough('bdgg_users_refresh');
