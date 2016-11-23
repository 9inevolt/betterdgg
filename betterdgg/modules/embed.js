import * as templates from './templates';

const PATH = 'embed/iframe.html';
const STRAWPOLL_URL  = /https?:\/\/(?:www\.)?strawpoll\.me\/(\w+)\/?$/;

let baseUrl;

function listener(e) {
    if (window != e.source) {
        return;
    }

    if (e.data.type === 'bdgg_url') {
        if (e.data.path === PATH) {
            baseUrl = e.data.url;
            window.removeEventListener('message', listener);
        }
    }
}

let embed = {
    init() {
        destiny.chat.gui.ui.append(templates.embed());
        window.addEventListener('message', listener);
        window.postMessage({type: 'bdgg_get_url', path: PATH}, '*');
        let $embed = $('#bdgg-embed');

        $embed.on('shown.bs.collapse', '.panel-collapse.collapse', () => {
            $embed.find('.glyphicon-chevron-down')
                .removeClass('glyphicon-chevron-down')
                .addClass('glyphicon-chevron-up');
        });

        $embed.on('hidden.bs.collapse', '.panel-collapse.collapse', () => {
            $embed.find('.glyphicon-chevron-up')
                .removeClass('glyphicon-chevron-up')
                .addClass('glyphicon-chevron-down');
        });
    },
    strawpoll(id) {
        console.log(`bdgg_strawpoll: ${id}`);
        let poll_id = encodeURIComponent(id);
        let url = encodeURIComponent(`https://www.strawpoll.me/embed_1/${poll_id}`);
        let src = `${baseUrl}?url=${url}`;

        $('#bdgg-embed').removeClass().addClass('bdgg-strawpoll')
            .find('.nano-content').empty()
            .append(templates.iframe({src}))
            .closest('.nano').nanoScroller();
    }
};

export default embed
