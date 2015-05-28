window.addEventListener("message", function(e) {
    if (!isWindow(e.source) || !e.data.type) {
        return;
    }

    if (e.data.type == 'bdgg_stalk_request') {
        //console.log("Stalk request received: " + e.data);
        var sock = MySocket();
        sock.onopen = function() {
          sock.send(JSON.stringify(e.data.query));
        };

        setTimeout(function() {
          if (sock.readyState < 2) {
            if (e.data.query['Number'] == 1) {
              postOutput("Timed out stalking " + e.data.query.Name);
            } else {
              postOutput("Timed out stalking multiple people.");
            }
            sock.close();
          }
        }, 5000);
    } else if (e.data.type == 'bdgg_flair_update') {
        //console.log("Flair update received: " + e.data);
        if (!e.data.sid) {
            return;
        }

        e.data.body.sid = encrypt(e.data.sid);

        var sock = MySocket();
        sock.onopen = function() {
            sock.send(JSON.stringify(e.data.body));
        };
    }
});

//stalk command and all supporting code. 
function MySocket()
{
  //var ws = new WebSocket("ws://ws.overrustlelogs.net:13373/ws");
  var ws = new WebSocket("ws://localhost:13373/ws"); // testing
  //console.log(ws.readyState);
  
  ws.onmessage = function(evt) {
    postReply(JSON.parse(evt.data));
    ws.close();
  };
  
  ws.onclose = function(evt) {
    //console.log("Connection closed.");
    //console.log("Code: " + evt.code + ", Reason: " + evt.reason + ", Clean: " + evt.wasClean);
    if (evt.code == 1005) {
      // not supposed to happen but does when we initiate close
    }
    else if (evt.code == 1006) {
      // not supposed to happen but does when nick doesn't match
      postOutput("Nick not found. Note: Nicks are case-sensitive.");
    }
    else if (evt.code > 1000 && evt.code < 1016) {
      postError("Error stalking: Connection closed unexpectedly.");
    }
  };
  
  return ws;
}

function encrypt(msg)
{
    var rsa = new RSAKey();
    rsa.setPublic('9D9AC233743B6C58CC1C14FBB1CCEE7E56982C1ECCA532183D551337BD45450298A02373DC16A344FAA8AA02DCC18051CA3DB37EA80D875EC1F8B921479819B3765F1B671EE937A0C8D96D2EBB5E9C68D4653CB903A829BCA47EF29A88BF5732E90AC9578610BF2E28EBCDA62FD9A2829C14C1B90755BF993902163A16DA7475', '10001');
    return hex2b64(rsa.encrypt(msg));
}

function postReply(data)
{
    pushMessage({ type: 'bdgg_stalk_reply', reply: data });
}

function postOutput(msg)
{
    pushMessage({ type: 'bdgg_stalk_message', message: msg });
}

function postError(msg)
{
    pushMessage({ type: 'bdgg_stalk_error', error: msg });
}

function pushMessage(obj)
{
    window.postMessage(obj, '*');
}
