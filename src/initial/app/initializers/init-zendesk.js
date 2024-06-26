/* global $ */

import config from '../config/environment';

function zopimCore(config) {
    let id = config.id;
    return [
        "<script type='text/javascript'>",
        "window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=",
        "d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.",
        "_.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');",
        "$.src='//v2.zopim.com/?" + id + "';z.t=+new Date;$.",
        "type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');",
        "</script>"
    ];
}

function zopimWindow(config) {
    if (!config) {
        return [];
    }

    let prefix = '$zopim.livechat.window.';
    let settings = [];

    if (config.offsetVertical) {
        settings.push(prefix + 'setOffsetVertical(' + config.offsetVertical + ');');
    }
    if (config.offsetHorizontal) {
        settings.push(prefix + 'setOffsetHorizontal(' + config.offsetHorizontal + ');');
    }
    if (config.position) {
        settings.push(prefix + 'setPosition(\'' + config.position + '\');');
    }
    if (config.size) {
        settings.push(prefix + 'setSize(\'' + config.size + '\');');
    }
    if (config.title) {
        settings.push(prefix + 'setTitle(\'' + config.title + '\');');
    }

    return settings;
}

function zopimBubble(config) {
    if (!config) {
        return [];
    }

    let prefix = '$zopim.livechat.bubble.';
    let settings = [];

    if (config.color) {
        settings.push(prefix + 'setColor(\'' + config.color + '\');');
    }

    return settings;
}

function zopimSettings(config) {
    let settings = [];

    settings = settings.concat(zopimWindow(config.window));
    settings = settings.concat(zopimBubble(config.bubble));

    return [
        "<script type='text/javascript'>",
        "$(document).ready(function() {",
        "$zopim(function() {",
        settings.join("\n"),
        "});",
        "});",
        "</script>"
    ];
}

export function initialize(container, application) {
    const init = config => {
        let zendesk = config.zendesk;

        if (zendesk && zendesk.key) {
            if (zendesk.initialized)
                return;

            $('body').append(
                [
                    `<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=${zendesk.key}"> </script>`,
                    `<style>iframe#launcher {display: none;}</style>`
                ].join("\n")
            );

            zendesk.initialized = true;

            return;
        }

        let zopimConfig = config.zopim;

        if (zopimConfig && zopimConfig.id && !zopimConfig.initialized) {
            let content = [];
            content = content.concat(zopimCore(zopimConfig));
            content = content.concat(zopimSettings(zopimConfig));
            content = content.join("\n");
            $('body').append(content);
            zopimConfig.initialized = true;
        }
    }

    application.one('config:ready', null, () => init(config));
    document.addEventListener('cookie-consent-update', e => init(e.detail), false);
}

export default {
    name: 'init-zendesk',
    after: 'init-branding-config',
    initialize: initialize
};
