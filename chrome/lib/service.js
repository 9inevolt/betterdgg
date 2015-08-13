var address = "ws://ws.overrustlelogs.net:13374/ws";
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

    port.onMessage.addListener(function(e) {
        if (!e.data || !e.data.type) {
            return;
        }

        if (e.data.type == 'bdgg_stalk_request') {
            var query = {
                QueryType: e.data.query.QueryType,
                Name: e.data.query["Name"],
                Names: e.data.query["Names"],
                Number: e.data.query["Number"],
                Session: e.data.query["Session"]
            };
            wamp.call('bdgg.stalk', query, {
                onSuccess: function(response) {
                    postReply(response);
                },
                onError: function(err) {
                    console.error('RPC error: ' + err);
                    postError("Error stalking", err);
                }
            });
        } else if (e.data.type == 'bdgg_flair_update') {
            //console.log("Flair update received: " + e.data);
            if (!e.data.token) {
                return;
            }

            var body = {
                etoken: encrypt(e.data.token),
                username: e.data.username
            }

            var proc = e.data.displayCountry ? 'bdgg.flair.update' : 'bdgg.flair.remove';

            wamp.call(proc, body, {
                onSuccess: function(response) {
                    //console.log('flair success: ' + response);
                },
                onError: function(err) {
                    console.error('flair RPC error: ' + err);
                    postError("Error updating flair", err);
                }
            });
        } else if (e.data.type == 'bdgg_users_refresh') {
            //console.log("Refresh users");
            wamp.call('bdgg.flair.get_all', null, {
                onSuccess: function(response) {
                    postUsers(response.users);
                }
            });
        }
    });

    function encrypt(msg)
    {
        var rsa = new RSAKey();
        rsa.setPublic('9D9AC233743B6C58CC1C14FBB1CCEE7E56982C1ECCA532183D551337BD45450298A02373DC16A344FAA8AA02DCC18051CA3DB37EA80D875EC1F8B921479819B3765F1B671EE937A0C8D96D2EBB5E9C68D4653CB903A829BCA47EF29A88BF5732E90AC9578610BF2E28EBCDA62FD9A2829C14C1B90755BF993902163A16DA7475', '10001');
        return hex2b64(rsa.encrypt(msg));
    }

    function postUsers(data)
    {
        pushMessage({ type: 'bdgg_users_refreshed', users: data });
    }

    function postReply(data)
    {
        pushMessage({ type: 'bdgg_stalk_reply', reply: data });
    }

    function postOutput(msg)
    {
        pushMessage({ type: 'bdgg_stalk_message', message: msg });
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
