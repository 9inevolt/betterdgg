;(function(bdgg) {
    bdgg.passivestalk = (function() {
        var style, cssBody, template, fnHandleCommand
        cssBody = '{background-color:rgba(18,144,117,0.25);color:rgba(255,255,255,0.8);}'
        template = '.user-msg[data-username="{}"]'
        fnHandleCommand = destiny.chat.handleCommand

        function PushChat(string) {
            destiny.chat.gui.push(new ChatInfoMessage(string))
        }
        destiny.chat.handleCommand = function(str) {
            var match, sendstr
            sendstr = str.trim()
            if (match = sendstr.match(/(ps|passivestalk)\s(\w+)/)) {
                var r = bdgg.settings.get('bdgg_passive_stalk')
                r = r.split(' ').join('').split(',')
                if (r.length === 1 && r[0] === '') r = []
                r.push(match[2])
                r = r.filter(function(val, idx, self) {
                    return self.indexOf(val) === idx
                })
                bdgg.settings.put('bdgg_passive_stalk', r.join(','))
                document.querySelector('#bdgg_passive_stalk').value = bdgg.settings.get('bdgg_passive_stalk')
            } else if (sendstr.match(/^(ps|passivestalk)\s*$/)) {
                PushChat("Command not understood.")
                PushChat("Format: /ps {username}")
            } else {
                fnHandleCommand.apply(this, arguments)
            }
        }
        return {
            init: function() {
                style = document.createElement('style')
                style.type = 'text/css'
                document.head.appendChild(style)
                bdgg.settings.addObserver(function(key, val) {
                    if (key == 'bdgg_passive_stalk')
                        bdgg.passivestalk.update(val)
                })
                bdgg.passivestalk.update(bdgg.settings.get('bdgg_passive_stalk'))
            },
            update: function(userList) {
                var res = ''
                userList = userList.toLowerCase().split(' ').join('').split(',')
                for (var i = 0; i < userList.length; i++)
                    res += template.replace('{}', userList[i]) + ','
                res = res.substring(0, res.length - 1)
                if (style.styleSheet)
                    style.styleSheet.cssText = res + cssBody
                else {
                    style.innerHTML = ''
                    style.appendChild(document.createTextNode(res + cssBody))
                }
            }
        }
    })()
}(window.BetterDGG = window.BetterDGG || {}))