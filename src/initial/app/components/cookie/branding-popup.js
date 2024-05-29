import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Component.extend({
    content: Ember.computed('title', function(){
        if(this.get('title') === 'Cookies Policy')
            return config.branding.cookiesPolicy;

        if(this.get('title') === 'Terms of service')
            return config.branding.tos;

        if(this.get('title') === 'Privacy')
            return config.branding.privacyPolicy;
    })
});
