(function(bdgg) {
    bdgg.passivestalk = (function() {
        var style, cssBody, template, fnHandleCommand;
        cssBody = '{background-color:rgba(18,144,117,0.25);color:rgba(255,255,255,0.8);}';
        template = '.user-msg[data-username="{}"]';
        fnHandleCommand = destiny.chat.handleCommand;

        function pushChat(string) {
            destiny.chat.gui.push(new ChatInfoMessage(string));
        }
        function updatePassivestalk(psList){
            var psTargets = psList.join(','); //in the settings the names are stored as "user1,user2,user3,..."
            bdgg.settings.put('bdgg_passive_stalk', psTargets);
            pushChat("Your passivestalk list has been updated");
            document.querySelector('#bdgg_passive_stalk').value = psTargets;
        }
        destiny.chat.handleCommand = function(str) {
            var match, sendstr;
            sendstr = str.trim();
            var psList = bdgg.settings.get('bdgg_passive_stalk').split(',');
            if (psList.length === 1 && psList[0] === '') psList = [];

            if (match = sendstr.match(/^(ps|passivestalk)\s(\w+)/)) {
                psList.push(match[2]);
                psList = psList.filter(function(val, idx, self) {
                    return self.indexOf(val) === idx;
                });
                updatePassivestalk(psList);
            } else if (match = sendstr.match(/^(unps|unpassivestalk)\s(\w+)/)){
                var matchIndex = psList.indexOf(match[2]);
                if (matchIndex === -1){
                    pushChat("User not found in your passivestalk list");
                } else {
                    psList.splice(matchIndex, 1);
                    updatePassivestalk(psList);
                }
            } else if (sendstr.match(/^(ps|passivestalk)\s*$/)) {
                if (psList.length === 0){
                    pushChat("Your passivestalk list is empty");    
                } else {
                    pushChat("Passively stalking the following users: " + psList.join(', '));
                }            
            } else {
                fnHandleCommand.apply(this, arguments);
            }
        };
        return {
            init: function() {
                style = document.createElement('style');
                style.type = 'text/css';
                document.head.appendChild(style);
                bdgg.settings.addObserver(function(key, val) {
                    if (key === 'bdgg_passive_stalk')
                        bdgg.passivestalk.update(val);
                });
                bdgg.passivestalk.update(bdgg.settings.get('bdgg_passive_stalk'));
            },
            update: function(userList) {
                var res = '';
                userList = userList.toLowerCase().split(' ').join('').split(',');
                for (var i = 0; i < userList.length; i++)
                    res += template.replace('{}', userList[i]) + ',';
                res = res.substring(0, res.length - 1);
                if (style.styleSheet)
                    style.styleSheet.cssText = res + cssBody;
                else {
                    style.innerHTML = '';
                    style.appendChild(document.createTextNode(res + cssBody));
                }
            }
        };
    })();
}(window.BetterDGG = window.BetterDGG || {}));
