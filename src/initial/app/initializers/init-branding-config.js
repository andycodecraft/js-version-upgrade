/* global _ */

import Ember from 'ember';
import config from '../config/environment';
import rsLogger from '../lib/rs-logger';

export function initialize(container, application) {
    application.deferReadiness();
    Ember.$.ajax({ url: 'branding/config.json', dataType: 'json' })
        .done(data => {
            _.merge(config, data);

            config.mixpanel.enabled = false;
            config.google_analytics.enabled = false;

            config.zopim_config_unused = config.zopim;
            delete config.zopim;

            config.zendesk_config_unused = config.zendesk;
            delete config.zendesk;

            let cookie_options = window.Cookies.get('cookie_options');
            if (cookie_options) {
                cookie_options = JSON.parse(cookie_options)
                for (const key in cookie_options) {
                    if(key === 'measurement' && !!cookie_options[key]){
                        config.mixpanel.enabled = true;
                        config.google_analytics.enabled = true;
                    }
                    else if(key === 'basic_interactions' && !!cookie_options[key]){
                        config.zopim = config.zopim_config_unused;
                        config.zendesk = config.zendesk_config_unused;
                    }
                }
            }

            application.trigger('config:ready');
        })
        .fail((jqXHR, textStatus, errorThrown) =>
            rsLogger.warn('BrandingConfig', `Failed to load branding config: ${errorThrown}`)
        )
        .always(() => application.advanceReadiness());

    const endpoints = {
        cookieConsent: 'branding/html/cookie.html',
        cookiesPolicy: 'branding/html/cookie-policy.html',
        privacyPolicy: 'branding/html/privacy.html',
        tos: 'branding/html/terms-and-conditions.html'
    };

    Object.keys(endpoints).forEach(key => {
        application.deferReadiness();
        Ember.$.ajax({ url: endpoints[key], dataType: 'html' })
            .done(data => config.branding[key] = data)
            .fail((jqXHR, textStatus, errorThrown) => {
                rsLogger.warn(key, `Failed to load branding:${key}: ${errorThrown}`)
            })
            .always(() => application.advanceReadiness());
    });
}

export default {
    name: 'init-branding-config',
    before: 'init-zendesk',
    initialize
};
