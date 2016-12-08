import _get from 'lodash.get';
import { postMessage } from '../messaging';
import * as templates from './templates';

const PATH = 'embed/iframe.html';
const STRAWPOLL_URL = /https?:\/\/(?:www\.)?strawpoll\.me\/(\w+)\/?$/;
const POLLSTERS = new Set(['Destiny']);
const FLASH_DELAY = 60000;
const HIDE_ALL_DELAY = 600000;

let $embed, $embedBtn;
let baseUrl;
let embedUrl;
let nextUrl, nextHtml;
let flashTimer, hideAllTimer;


function frameSrc(url) {
    return `${baseUrl}?url=${encodeURIComponent(url)}`;
}

function embedLinkClick() {
    embed.strawpoll($(this).data('pollId'));
    embed.show();
}

let embed = {
    init() {
        postMessage('bdgg_get_url', PATH).then(url => {
            baseUrl = url;
        });

        destiny.chat.gui.lines.on('click', '.bdgg-embed-link', embedLinkClick);
        destiny.chat.gui.ui.append(templates.embed());
        $('#chat-tools-wrap').prepend(templates.embed_button());
        $embed = $('#bdgg-embed');
        $embedBtn = $('#bdgg-embed-btn');

        $embed.on('click', '.close', () => {
            this.hide();
        });

        $embedBtn.on('click', () => {
            this.show();
        });
    },
    flash(delay = FLASH_DELAY) {
        this.clearFlash();
        flashTimer = setTimeout(() => {
            this.clearFlash();
        }, delay);
        $embedBtn.addClass('bdgg-flash-white');

        if (!this.isVisible()) {
            this.scheduleHideAll();
        }
    },
    clearFlash() {
        clearTimeout(flashTimer);
        $embedBtn.removeClass('bdgg-flash-white');
    },
    next(url, html) {
        nextUrl = url;
        nextHtml = html;
        $embedBtn.show();
    },
    isVisible() {
        return $embed.is(':visible');
    },
    show() {
        $embed.show();

        if (embedUrl !== nextUrl) {
            embedUrl = nextUrl;
            $embed.html(nextHtml).find('.nano').nanoScroller();
        }

        this.clearFlash();
        this.clearHideAll();
    },
    hide() {
        $embed.hide();
        this.scheduleHideAll();
    },
    hideAll() {
        $embed.hide();
        $embedBtn.hide();
    },
    scheduleHideAll(delay = HIDE_ALL_DELAY) {
        this.clearHideAll();
        hideAllTimer = setTimeout(() => {
            this.hideAll();
        }, delay);
    },
    clearHideAll() {
        clearTimeout(hideAllTimer);
    },
    strawpoll(id) {
        let pollId = encodeURIComponent(id);
        let pollTitle = `strawpoll.me/${pollId}`;
        let pollUrl = `https://www.strawpoll.me/${pollId}`;
        let pollEmbedUrl = `https://www.strawpoll.me/embed_1/${pollId}`;
        let pollHtml = templates.embed_strawpoll.bind(null, {pollTitle, pollUrl, src: frameSrc(pollEmbedUrl)});
        this.next(pollEmbedUrl, pollHtml);
    },
    wrapMessage(elem, message) {
        let isPollster = POLLSTERS.has(_get(message, 'user.username'));

        elem.find('a[href]').each(function(i, a) {
            let match;
            if (match = STRAWPOLL_URL.exec(a.getAttribute('href'))) {
                let pollId = match[1];
                $(a).after(templates.embed_link_strawpoll({pollId}));

                if (isPollster) {
                    embed.strawpoll(pollId);
                    embed.flash();
                }
            }
        });
    }
};

export default embed;
