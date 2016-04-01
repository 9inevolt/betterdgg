(function(bdgg) {
    bdgg.notification = (function() {
        return {
            init: function() {
                var fnChatPRIVMSG = destiny.chat.onPRIVMSG;
                var bdggChatPRIVMSG = function(data) {
                    var bdggPRIVMSG = fnChatPRIVMSG.apply(this, arguments);
                    var notif;
                    var isChrome = !!window.chrome && !!window.chrome.webstore;
                    if (bdgg.settings.get('bdgg_Private_Message_Notifications')) {
                        var memes = {
                            body: data.nick + " sent you a private message. Click here to view the chat!",
                            icon: destiny.cdn + '/chat/img/notifyicon.png'
                        };
                        if (Notification.permission === 'granted' && isChrome){
                            notif = new Notification("Better Better Destiny.GG", memes);
                            notif.onclick = function() { 
                                window.focus();
                                notif.close();
                                if ($(".mark-as-read")) {
                                    $(".mark-as-read").click();
                                }
                            };
                            setTimeout(function(){ notif.close(); }, 5000);
                        } else if (Notification.permission === 'granted' && !isChrome){
                            notif = new Notification("Better Better Destiny.GG", memes);
                            setTimeout(function(){ notif.close(); }, 5000);
                        }
                    }
                    return bdggPRIVMSG;
                };
                destiny.chat.onPRIVMSG = bdggChatPRIVMSG;
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
