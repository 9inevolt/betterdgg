import alert from './modules/alert';
import backlog from './modules/backlog';
import casino from './modules/casino';
import chat from './modules/chat';
import countries from './modules/countries';
import emoticons from './modules/emoticons';
import filter from './modules/filter';
import firstrun from './modules/firstrun';
import flair from './modules/flair';
import formatters from './modules/formatters';
import help from './modules/help';
import ignore from './modules/ignore';
import leftchat from './modules/leftchat';
import mentions from './modules/mentions';
import notification from './modules/notification';
import overrustle from './modules/overrustle';
import passivestalk from './modules/passivestalk';
import phrases from './modules/phrases';
import security from './modules/security';
import settings from './modules/settings';
import spooky from './modules/spooky';
import stalk from './modules/stalk';
import * as templates from './modules/templates';
import test from './modules/test';
import theme from './modules/theme';
import twitchchat from './modules/twitchchat';
import users from './modules/users';
import version from './modules/version';

let init = function() {
    // TODO: find a cleaner way to load this
    settings.init();
    formatters.init();
    emoticons.init();
    chat.init();
    ignore.init();
    spooky.init();
    casino.init();
    leftchat.init();
    overrustle.init();
    mentions.init();
    notification.init();
    countries.init();
    stalk.init();
    flair.init();
    users.init();
    filter.init();
    passivestalk.init();
    phrases.init();
    twitchchat.init();
    security.init();
    backlog.init();
    alert.init();
    help.init();
    theme.init();
    firstrun.init();
};

let BetterDGG = {
    init,
    alert,
    backlog,
    casino,
    chat,
    countries,
    emoticons,
    filter,
    firstrun,
    flair,
    formatters,
    help,
    ignore,
    leftchat,
    mentions,
    notification,
    overrustle,
    passivestalk,
    phrases,
    security,
    settings,
    spooky,
    stalk,
    templates,
    test,
    theme,
    twitchchat,
    users,
    version,
};

if (DEBUG) {
    window.BetterDGG = window.BetterDGG || BetterDGG;
}

BetterDGG.init();

export default BetterDGG
