import Ember from 'ember';
import config from '../config/environment';

const storageKey = 'floating-menu-hidden';

export default Ember.Component.extend({
    zendeskHelpWindowVisible: false,
    zendeskHandlersSet: false,
    hasZendesk: !!config.zendesk,
    zopimChatWindowVisible: false,
    zopimOnHideHandlerSet: false,
    hasZopim: !config.zendesk && !!config.zopim,
    hasCookies: !!config.branding.cookieConsent,
    hasPrivacyPolicy: !!config.branding.privacyPolicy,
    hasTOS: !!config.branding.tos,
    open: true,
    show: function () {
        return (
            !this.get('showCookiePopup')
            && !this.get('zendeskHelpWindowVisible')
            && !this.get('zopimChatWindowVisible')
            && (this.hasZopim || this.hasZendesk || this.hasCookies || this.hasPrivacyPolicy || this.hasTOS)
        );
    }.property('showCookiePopup', 'zendeskHelpWindowVisible', 'zopimChatWindowVisible'),
    init() {
        this._super(...arguments);

        if (window.localStorage) {
            if (localStorage.getItem(storageKey) === 'true')
                this.set('open', false);
        }

        document.addEventListener('cookie-consent-update', e => {
            const hasZendesk = !!e.detail.zendesk;
            this.set('hasZendesk', hasZendesk)

            if (hasZendesk)
                return;

            this.set('hasZopim', !!e.detail.zopim);
        });

        if (window.zE)
            this.send('setZendeskHandlers');

        if (window.$zopim)
            this.send('setZopimOnHideHandler');
    },
    actions: {
        open() {
            if (window.localStorage)
                localStorage.removeItem(storageKey);
            this.set('open', true);
        },
        close() {
            if (window.localStorage)
                localStorage.setItem(storageKey, 'true');
            this.set('open', false);
        },
        setZendeskHandlers() {
            if (this.zendeskHandlersSet)
                return;

            zE('webWidget:on', 'open', () => this.set('zendeskHelpWindowVisible', true));
            zE('webWidget:on', 'close', () => this.set('zendeskHelpWindowVisible', false));
            this.set('zendeskHandlersSet', true);
        },
        showZendeskHelp() {
            if (!window.zE)
                return;

            this.send('setZendeskHandlers');
            zE('webWidget', 'open');
            this.set('zendeskHelpWindowVisible', true);
        },
        setZopimOnHideHandler() {
            if (this.zopimOnHideHandlerSet)
                return;

            $zopim(() => $zopim.livechat.window.onHide(() => this.set('zopimChatWindowVisible', false)));
            this.set('zopimOnHideHandlerSet', true);
        },
        showZopimChatWindow() {
            if (!window.$zopim)
                return;

            this.send('setZopimOnHideHandler');
            $zopim.livechat.window.show();
            this.set('zopimChatWindowVisible', true);
        },
        showCookieOptions() {
            $('.cookie-options').modal('show');
        },
        showTermsPrivacyPop(title) {
            this.set('popupTitle', title)
            $('.terms-privacy').modal('show');
        }
    }
});
