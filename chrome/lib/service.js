import Wampy from 'wampy/build/wampy.min';
import { hex2b64, RSAKey } from './jsbn';
import { onMessage } from './messaging';

var address = "ws://ts.downthecrop.xyz:13374/ws";
//var address = "ws://127.0.0.1:13374/ws"; //testing

chrome.runtime.onConnect.addListener(function(port) {
    var wamp = new Wampy(address, {
        realm: 'bdgg',
        onConnect: function() {
            //console.log('wamp connected');
        },
        onError: function(e) { console.error('wamp error: ' + e); }
    });

    wamp.subscribe('bdgg.flair.refresh', {
        onSuccess: function() {
            //console.log('successfully subscribed');
        },
        onError: function(err) { console.error('subscription error: ' + err); },
        onEvent: function(data) {
            //console.log('refresh: ' + data);
            postUsers(data.users);
        }
    });

    port.onDisconnect.addListener(function() {
        wamp.disconnect();
    });

    onMessage('bdgg_stalk_request', query => {
        return new Promise((resolve, reject) => {
            wamp.call('bdgg.stalk', query, {
                onSuccess: resolve,
                onError: err => {
                    console.error('RPC error: ' + err);
                    reject(`Error stalking: ${err}`);
                }
            });
        });
    });

    onMessage('bdgg_flair_update', data => {
        return new Promise((resolve, reject) => {
            if (!data.token) {
                reject('No token');
                return;
            }

            const body = {
                etoken: encrypt(data.token),
                username: data.username
            };

            const proc = data.displayCountry ? 'bdgg.flair.update' : 'bdgg.flair.remove';

            wamp.call(proc, body, {
                onSuccess: resolve,
                onError: err => {
                    console.error('flair RPC error: ' + err);
                    reject(`Error updating flair: ${err}`);
                }
            });
        });
    });

    onMessage('bdgg_users_refresh', () => {
        return new Promise((resolve, reject) => {
            wamp.call('bdgg.flair.get_all', null, {
                onSuccess: resolve,
                onError: err => {
                    console.error('flair RPC error: ' + err);
                    reject(`Error refreshing users: ${err}`);
                }
                // postUsers(response.users);
            });
        });
    });

    function encrypt(msg)
    {
        var rsa = new RSAKey();
        rsa.setPublic('B3872AD118E56C09EC4ADF30FC1A315B08ED521806173E975451A4F1C41B91CA8AC07CD7A58A0E5ED4125351EFE626CA8BC76376CFFB4A7B6DE22503E9496DDA0FB47E35B04B304E2ED01A5D596021EA650C930EFDBE1198763EF95293A3C8BCD374A199F4E7632833BE6955204FCF30D83916582845747DF6E6770FCD1230BF02C0DF03D84C853C0B0C19927184E7FE8192440477208C473D051DDBAA65825972027233D24A1EFCBE0292A08FF9FD79868F9D39870CCA6AC022F85A2D9E2BAC5886DE2C9817B7361C6966D9CF75B155178B710906B048BB45EA5658CFFD15B2208B90F495C0E7510241D8D09EA174A5BC4369946A565985AA1CFB992378AE1D', '10001');
        return hex2b64(rsa.encrypt(msg));
    }

    function postUsers(data)
    {
        pushMessage({ type: 'bdgg_users_refreshed', users: data });
    }

    function postError(msg, detail)
    {
        if (typeof detail === 'string') {
            msg = msg + ": " + detail;
        } else if (detail && typeof detail[0] === 'string') {
            msg = msg + ": " + detail[0];
        }
        pushMessage({ type: 'bdgg_stalk_error', error: msg });
    }

    function pushMessage(obj)
    {
        port.postMessage(obj);
    }
});
