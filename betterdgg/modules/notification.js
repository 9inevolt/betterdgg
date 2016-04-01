(function(bdgg) {
    bdgg.notification = (function() {
        return {
            init: function() {
                if (bdgg.settings.get('bdgg_Private_Message_Notifications')){
                    bdgg.notification.checkPerms();
                }
                var fnChatPRIVMSG = destiny.chat.onPRIVMSG;
                var bdggChatPRIVMSG = function(data) {
                    var bdggPRIVMSG = fnChatPRIVMSG.apply(this, arguments);
                    var notif;
                    if (bdgg.settings.get('bdgg_Private_Message_Notifications')) {
                        var memes = {
                            body: data.nick + " sent you a private message. Click here to view the chat!",
                            icon: destiny.cdn + '/chat/img/notifyicon.png'
                        };
                        if (Notification.permission === 'granted'){
                            notif = new Notification("Better Better Destiny.GG", memes);
                            notif.onclick = function() { 
                                window.focus();
                                notif.close();
                                if ($(".mark-as-read")) {
                                    $(".mark-as-read").click();
                                }
                            };
                            setTimeout(function(){ notif.close(); }, 5000);
                        } 
                    }
                    return bdggPRIVMSG;
                };
                destiny.chat.onPRIVMSG = bdggChatPRIVMSG;
            },
            checkPerms: function() {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then(function(result) {
                        if (result === 'denied') {
                            destiny.chat.gui.push(new ChatInfoMessage('You have refused permission to present notifications, You will be unable to use the private message notifications feature.'));
                            bdgg.settings.put('bdgg_Private_Message_Notifications', false);
                            return;
                        }
                        if (result === 'default') {
                            destiny.chat.gui.push(new ChatInfoMessage('You have dismissed the request for permission to present notifications, You will be unable to use private message notifications feature.'));
                            bdgg.settings.put('bdgg_Private_Message_Notifications', false);
                            return;
                        }
                        
                    });
                }
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
