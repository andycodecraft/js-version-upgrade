/* global Modernizr, logger */

import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({

    authentication: Ember.inject.service(),

    title: function (tokens) {
        let title = config.APP.debugging ? '[' + this.controllerFor('application').get('currentRouteName') + '] ' : '';
        let titleBrandName = this.get('controller.i18n').t('application.page_title_brand_name');

        if (tokens && tokens.length) {
            return title + tokens.join(' - ') + ' - ' + titleBrandName;
        } else {
            return title + titleBrandName;
        }
    },

    beforeModel: function () {
        if (!Modernizr.canvas || !window.btoa) {
            logger.warn('Client does not meet browser requirements: ' + navigator.userAgent);
            this.transitionTo('incompatible-browser');
        }

        this.get('authentication').getUserInfo();
    },

    afterModel: function () {
        this.controllerFor('application').send('popSpinner');
    },

    actions: {
        loading: function (/*transition, originRoute*/) {
            this.controllerFor('application').send('pushSpinner');
        },
        error: function (errorResponse, transition) {
            this.controllerFor('application').send('showApplicationError', errorResponse, transition);
        },
        onResourceError(errorResponse) {
            this.controllerFor('application').setProperties({
                'errors': errorResponse.errors,
                'errorMessage': errorResponse.message
            });

            logger.error('ResourceError', 'Received a ResourceError: ' + errorResponse.message + ' Errors:' + errorResponse.errors);
        },
        didTransition() {
            if (window.Cookies.get('cookie_options')) {
                let cookie_options = JSON.parse(window.Cookies.get('cookie_options'))
                for (const key in cookie_options) {
                    let value = cookie_options[key];
                    if (!value) {
                        this.send('disableCookies', key)
                    }
                }
            }
            else if (config.branding.cookieConsent) {
                this.send('disableCookies', 'basic_interactions')
                this.send('disableCookies', 'measurement')
            }
        },
        disableCookies(id) {
            let options = {};
            if (config.cookieDomain) {
              options = {
                domain: config.cookieDomain
              }
            }
            if (id == 'strictly_necessary') {
              if(window.localStorage && localStorage.removeItem){
                localStorage.removeItem('rs-session');
                localStorage.removeItem('usertour.interview');
              }
              window.Cookies.expire('AWSALB', options)
              window.Cookies.expire('AWSALBCORS', options)
              window.Cookies.expire('cookies.js', options)
            } 
            else if (id == 'basic_interactions') {
              window.Cookies.expire('zte#', options)
              window.Cookies.expire('__zlcmid', options)
            }
            else if (id == 'measurement') {
                window.Cookies.expire('_ga', options)
                window.Cookies.expire('_gat', options)
                window.Cookies.expire('_gid', options)
                window.Cookies.expire('collect', options)
                if (config.google_analytics.tracking_id) {
                    window[`ga-disable-${config.google_analytics.tracking_id}`] = true;
                    window[`gat-disable-${config.google_analytics.tracking_id}`] = true;
                    window[`gid-disable-${config.google_analytics.tracking_id}`] = true;
                    window[`collect-disable-${config.google_analytics.tracking_id}`] = true;
                }
                if (config.mixpanel.token) {
                    window.Cookies.expire(`mp_${config.mixpanel.token}_mixpanel`, options)
                }
                config.mixpanel.enabled = false;
            }
        }
    }
});
