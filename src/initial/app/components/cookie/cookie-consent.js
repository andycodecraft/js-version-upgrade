import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
  content: config.branding.cookieConsent,
  hasCookiesPolicy: !!config.branding.cookiesPolicy,
  actions: {
    showOptions() {
      $('.cookie-options').modal('show');
      this.set('showCookiePopup', false)
    },
    setCookie() {
      this.set('showCookiePopup', false)
      let expires = new Date(new Date().getTime() + 15 * 24* 60 * 60 * 1000);
      window.Cookies.set('cookie_accepted', true, { expires })
      let options = {
        strictly_necessary: true,
        basic_interactions: true,
        measurement: true
      }
      window.Cookies.set('cookie_options', JSON.stringify(options), { expires })
      this.set('cookieOptionChanged', !this.get('cookieOptionChanged'))
    },
    showCookiesPolicy() {
      this.set('title', 'Cookies Policy');
      $('.terms-privacy').modal('show');
    }
  }
});
