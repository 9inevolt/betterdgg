import debounce from 'debounce';
import { postMessage } from '../messaging';
import security from './security';
import settings from './settings';

const SELECTOR = '#chat-lines a.externallink';
const DOMAINS = new Set([
    'youtube.com',
    'youtu.be',
    'bit.ly',
    'goo.gl',
    'ow.ly',
    't.co',
    'twitter.com',
    'tinyurl.com',
    'tr.im',
    'twitch.tv'
]);

let linkData = new Map();

function onData(url, data) {
    linkData.set(url, data);

    if (!data || !data.tooltip) {
        return;
    }

    let elem = $('<div>').append(data.tooltip);
    security.sanitize(elem);
    data.tooltip = elem.get(0).outerHTML;

    $(SELECTOR).filter(`[href="${url}"]`).tooltip({
        html: true,
        placement: 'auto top',
        title: data.tooltip,
        trigger: 'manual'
    }).each(function() {
        let $this = $(this);
        if ($this.is(':hover')) {
            $this.tooltip('show');
        }
    });
}

function resolveLink(url) {
    if (linkData.has(url)) {
        return linkData.get(url);
    }

    postMessage('bdgg_get_linkinfo', url)
        .then(data => { onData(url, data); })
        .catch(() => {});
}

let hoverLink = debounce(function() {
    let domain = this.hostname.split('.').slice(-2).join('.');
    if (!DOMAINS.has(domain)) {
        return;
    }

    let $this = $(this);
    let url = $this.attr('href');

    let data = resolveLink(url);
    if (!data || !data.tooltip) {
        return;
    }

    if ($this.is(':hover')) {
        $this.tooltip('show');
    }
}, 250);

let linkinfo = {
    init() {
        this.enabled(settings.get('bdgg_show_linkinfo'));
        settings.on('bdgg_show_linkinfo', value => { this.enabled(value); });
    },
    enabled(value) {
        if (value) {
            $('body').on('mouseover', SELECTOR, hoverLink);
            $('body').on('mouseout', SELECTOR, function() {
                $(this).tooltip('hide');
            });
        } else {
            $('body').off('mouseover', SELECTOR, hoverLink);
        }
    }
};

export default linkinfo;
