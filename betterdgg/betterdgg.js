import alert from './modules/alert';
import casino from './modules/casino';
import countries from './modules/countries';
import emoticons from './modules/emoticons';
import filter from './modules/filter';
import firstrun from './modules/firstrun';
import flair from './modules/flair';
import help from './modules/help';
import formatters from './modules/formatters';
import overrustle from './modules/overrustle';
import security from './modules/security';
import settings from './modules/settings';
import spooky from './modules/spooky';
import stalk from './modules/stalk';
import * as templates from './modules/templates';
import test from './modules/test';
import theme from './modules/theme';
import users from './modules/users';
import version from './modules/version';

let init = function() {
    // TODO: find a cleaner way to load this
    settings.init();
    formatters.init();
    emoticons.init();
    spooky.init();
    casino.init();
    overrustle.init();
    countries.init();
    stalk.init();
    flair.init();
    users.init();
    filter.init();
    security.init();
    help.init();
    theme.init();
    firstrun.init();
};

let BetterDGG = {
    init,
    alert,
    casino,
    countries,
    emoticons,
    filter,
    firstrun,
    flair,
    help,
    formatters,
    overrustle,
    security,
    settings,
    spooky,
    stalk,
    templates,
    test,
    theme,
    users,
    version,
};

if (DEBUG) {
    window.BetterDGG = window.BetterDGG || BetterDGG;
} else {
    BetterDGG.init();
}

export default BetterDGG
