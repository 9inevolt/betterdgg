(function(bdgg) {
    bdgg.notification = (function() {
        return {
            init: function() {
                if (bdgg.settings.get('bdgg_private_message_notifications')){
                    bdgg.notification.checkPerms();
                }
                bdgg.settings.addObserver(function(key, val) {
                    if (key === 'bdgg_private_message_notifications' && val)
                        bdgg.notification.checkPerms();
                });
                var fnChatPRIVMSG = destiny.chat.onPRIVMSG;
                var bdggChatPRIVMSG = function(data) {
                    var ignoreList = bdgg.settings.get('bdgg_user_ignore');
                    if (ignoreList !== "") {
                        var ignoreArray = ignoreList.toLowerCase().split(' ').join('').split(',');
                    }
                    var bdggPRIVMSG = fnChatPRIVMSG.apply(this, arguments);
                    var notif;
                    if (ignoreArray.indexOf(data.nick.toLowerCase()) === -1) {

                        if (bdgg.settings.get('bdgg_private_message_notifications')) {
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
                            bdgg.settings.put('bdgg_private_message_notifications', false);
                            return;
                        }
                        if (result === 'default') {
                            destiny.chat.gui.push(new ChatInfoMessage('You have dismissed the request for permission to present notifications, You will be unable to use private message notifications feature.'));
                            bdgg.settings.put('bdgg_private_message_notifications', false);
                            return;
                        }
                        
                    });
                }
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
