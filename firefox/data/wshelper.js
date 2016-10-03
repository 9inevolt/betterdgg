var address = "ws://ts.downthecrop.xyz:13374/ws";
//var address = "ws://127.0.0.1:13374/ws"; //testing

onAttach = function(e) {
    console.log("websocket pageWorker attached");

    var wamp = new Wampy(address, {
        realm: 'bdgg',
        onConnect: function() {
            console.log('wamp connected');
        },
        onError: function(e) { console.error('wamp error: ' + JSON.stringify(e, null, 4)); }
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

    self.port.on("detach", function() {
        console.log("websocket pageWorker port detached");
        wamp.disconnect();
    });

    self.on("detach", function() {
        console.log("websocket pageWorker detached");
        wamp.disconnect();
    });

    self.on("message", function(e) {
        //console.log("websocket page message: " + JSON.stringify(e, null, 4));

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
        rsa.setPublic('B3872AD118E56C09EC4ADF30FC1A315B08ED521806173E975451A4F1C41B91CA8AC07CD7A58A0E5ED4125351EFE626CA8BC76376CFFB4A7B6DE22503E9496DDA0FB47E35B04B304E2ED01A5D596021EA650C930EFDBE1198763EF95293A3C8BCD374A199F4E7632833BE6955204FCF30D83916582845747DF6E6770FCD1230BF02C0DF03D84C853C0B0C19927184E7FE8192440477208C473D051DDBAA65825972027233D24A1EFCBE0292A08FF9FD79868F9D39870CCA6AC022F85A2D9E2BAC5886DE2C9817B7361C6966D9CF75B155178B710906B048BB45EA5658CFFD15B2208B90F495C0E7510241D8D09EA174A5BC4369946A565985AA1CFB992378AE1D', '10001');
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
        //console.log('pushMessage: ' + JSON.stringify(obj, null, 4));
        self.postMessage(obj);
    }
};

// Delay attaching to self because of some race condition
setTimeout(function() {
    self.port.on('attach', onAttach);
}, 0);
