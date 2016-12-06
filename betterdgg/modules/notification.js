import settings from './settings';

let notification = {
    init: function() {
        if (settings.get('bdgg_private_message_notifications')) {
            this.checkPerms();
        }
        settings.on('bdgg_private_message_notifications', value => {
            if (value) {
                this.checkPerms();
            }
        });
        var fnChatPRIVMSG = destiny.chat.onPRIVMSG;
        var bdggChatPRIVMSG = function(data) {
            var ignoreList = settings.get('bdgg_user_ignore');
            var ignoreArray;
            if (ignoreList !== "") {
                ignoreArray = ignoreList.toLowerCase().split(' ').join('').split(',');
            } else {
                ignoreArray = [""];
            }
            var bdggPRIVMSG = fnChatPRIVMSG.apply(this, arguments);
            var notif;
            if (ignoreArray.indexOf(data.nick.toLowerCase()) === -1) {
                if (settings.get('bdgg_private_message_notifications')) {
                    var memes = {
                        body: data.nick + " sent you a private message. Click here to view the chat!",
                        icon: destiny.cdn + '/chat/img/notifyicon.png',
                        data: { messageid: data.messageid }
                    };
                    if (Notification.permission === 'granted'){
                        notif = new Notification("Better Better Destiny.GG", memes);
                        notif.onclick = function() {
                            window.focus();
                            this.close();
                            var msg = destiny.chat.gui.lines.children(
                                '[data-messageid="' + this.data.messageid + '"]');
                            msg.find('.mark-as-read').click();
                            destiny.chat.gui.scrollPlugin.scrollTo(msg);
                        };
                        setTimeout(() => { notif.close(); }, 5000);
                    }
                }
            }
            return bdggPRIVMSG;
        };
        destiny.chat.onPRIVMSG = bdggChatPRIVMSG;
    },
    checkPerms: function() {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then((result) => {
                this.handlePerms(result);
            });
        } else {
            this.handlePerms(Notification.permission);
        }
    },
    handlePerms: function(result) {
        if (result === 'denied') {
            destiny.chat.gui.push(new ChatInfoMessage(
                'You have refused permission to present notifications, You will be unable to use the private message notifications feature.'));
            settings.put('bdgg_private_message_notifications', false);
        } else if (result === 'default') {
            destiny.chat.gui.push(new ChatInfoMessage(
                'You have dismissed the request for permission to present notifications, You will be unable to use private message notifications feature.'));
            settings.put('bdgg_private_message_notifications', false);
        }
    }
};

export default notification
