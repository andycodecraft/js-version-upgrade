import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  cookieContent: config.branding.cookieConsent,
  hasCookiesPolicy: !!config.branding.cookiesPolicy,
  onCookieOptionChanged: function () {
    this.send('updateOptions');
}.observes('cookieOptionChanged'),
  init() {
    this._super(...arguments)
    this.set('options', [
      {
        id: 'strictly_necessary',
        title: 'Strictly necessary',
        description: 'These trackers are used for activities that are strictly necessary to operate or deliver the service you requested from us and, therefore, do not require you to consent.',
        showDescription: false,
        checked: true,
        disabled: true
      },
      {
        id: 'basic_interactions',
        title: 'Basic interactions & functionalities',
        description: 'These trackers enable basic interactions and functionalities that allow you to access selected features of our service and facilitate your communication with us.',
        showDescription: false,
        checked: false,
        disabled: false
      },
      {
        id: 'measurement',
        title: 'Measurement',
        description: 'These trackers help us to measure traffic and analyze your behavior with the goal of improving our service.',
        showDescription: false,
        checked: false,
        disabled: false
      }
    ])
  },
  didInsertElement: function () {
    this.send('updateOptions')
  },
  actions: {
    closeBox() {
      if (!window.Cookies.get('cookie_accepted')) {
        this.set('showCookiePopup', true)
      }
    },
    toggleDescription(option) {
      Ember.set(option, 'showDescription', !option.showDescription);
    },
    accept() {
      let options = {};
      this.get('options').forEach(option => {
        options[option.id] = this.$(`#${option.id}_option`).prop('checked')
        if (options[option.id]) {
          this.send('enableCookies', option.id)
        } else {
          this.send('disableCookies', option.id)
        }
      })
      let expires = new Date(new Date().getTime() + 15 * 24* 60 * 60 * 1000);
      window.Cookies.set('cookie_accepted', true, { expires })
      window.Cookies.set('cookie_options', JSON.stringify(options), { expires })

      try{
        const cookieConsentUpdate = new CustomEvent('cookie-consent-update', { detail: config });
        document.dispatchEvent(cookieConsentUpdate);
      }
      catch(e){
        logger.warn('CookieConsentUpdateWarning', e);
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

        if(config.zendesk)
          delete config.zendesk;

        if(config.zopim)
          delete config.zopim;
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
        config.google_analytics.enabled = false;
        config.mixpanel.enabled = false;
      }
    },
    enableCookies(id) {
      if (id == 'strictly_necessary') {

      } 
      else if (id == 'basic_interactions') {
        if(!('zendesk' in config) && 'zendesk_config_unused' in config)
          config.zendesk = config.zendesk_config_unused;

        if(!('zopim' in config) && 'zopim_config_unused' in config)
          config.zopim = config.zopim_config_unused;
      }
      else if (id == 'measurement') {
        if (config.google_analytics.tracking_id) {
            window[`ga-disable-${config.google_analytics.tracking_id}`] = false;
            window[`gat-disable-${config.google_analytics.tracking_id}`] = false;
            window[`gid-disable-${config.google_analytics.tracking_id}`] = false;
            window[`collect-disable-${config.google_analytics.tracking_id}`] = false;
        }
        config.mixpanel.enabled = true;
        config.google_analytics.enabled = true;
      }
    },
    showCookiesPolicy() {
      this.set('title', 'Cookies Policy');
      $('.terms-privacy').modal('show');
    },
    updateOptions() {
      if (window.Cookies.get('cookie_options')) {
        let cookie_options = JSON.parse(window.Cookies.get('cookie_options'))
        for (const key in cookie_options) {
          let value = cookie_options[key];
          this.$(`#${key}_option`).prop('checked', value);
          if(!!value){
            this.send('enableCookies', key)
          } else{
            this.send('disableCookies', key)
          }
        }
        try{
          const cookieConsentUpdate = new CustomEvent('cookie-consent-update', { detail: config });
          document.dispatchEvent(cookieConsentUpdate);
        }
        catch(e){
          logger.warn('CookieConsentUpdateWarning', e);
        }
      }
    }
  }
});
