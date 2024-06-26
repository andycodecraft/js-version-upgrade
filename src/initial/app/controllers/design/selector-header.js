/* global logger */

import Ember from 'ember';
import config from '../../config/environment';
import logger from "../../lib/rs-logger";

export default Ember.Controller.extend({
    needs: ['design', 'design/selector', 'application', 'design/checkout'],

    authentication: Ember.inject.service(),
    designService: Ember.inject.service('design-service'),

    isAuthenticated: Ember.computed.alias('authentication.isAuthenticated'),
    userName: Ember.computed.alias('authentication.user.name'),
    userEmail: Ember.computed.alias('authentication.user.email'),

    b2bSite: config.b2b,

    firstInitial: function () {
        let userName = this.get('userName');
        if (!userName) {
            return null;
        }
        return userName[0].toUpperCase();
    }.property('userName'),

    isSaving: false,

    obtainRegionByCountryCode(countryCode) {
        return this
            .store
            .all('region')
            .filterBy('iso_alpha_2', countryCode)
            .get('firstObject');
    },

    showCurrencyDropdown: Ember.computed(
        'controllers.application.bootstrapBreakpoint',
        function () {
            const region = this.obtainRegionByCountryCode(
                this.store
                    .all('mycountry')
                    .get('firstObject.country')
            );
            return this.get('controllers.application.bootstrapBreakpoint') !== 'xs' && !region;
        }
    ),

    price: function () {
        return this.get('model.price');
    }.property('model.price'),

    currency: Ember.computed.alias('controllers.design.currency'),

    localTotalPriceStr: Ember.computed.alias('controllers.design/checkout.totalPriceStr'),

    designController: function () {
        return this.get('controllers.design');
    }.property('controllers.design'),

    description: function () {
        this.set('controllers.application.title', this.get('model.description'));
        return this.get('model.description');
    }.property('model.description'),

    incompleteOrder: function () {
        return this.get('model.activePositions.length') === 0;
    }.property('model.activePositions'),

    isDesktop: function () {
        let bootstrapBreakpoint = this.get('controllers.application.bootstrapBreakpoint');
        return bootstrapBreakpoint && (bootstrapBreakpoint === 'md' || bootstrapBreakpoint === 'lg');
    }.property('controllers.application.bootstrapBreakpoint'),

    routeChange: function () {
        this.send('closeMenus');
    }.observes('controllers.application.currentPath'),

    init() {
        this.send('closeComingSoonModal');
        this.get('designService')
            .toPNG(this.get('model'))
            .then((imageUrl) => {
                this.set('design_image_url', imageUrl);
            })
    },

    actions: {

        socialShare: function () {
            this.replaceRoute('design.selector.socialShare');
        },

        b2bCheckout: function(data){
            let region = this.store.all('region')
                .filterBy('iso_alpha_2', this.store.all('mycountry').get('firstObject').get('country'))
                .get('firstObject');
            if(typeof region === "undefined"){
                logger.warn('Country not found - default to US');
                region = this.store.all('region').filterBy('iso_alpha_2', 'US').get('firstObject');
            }

            const shippingAddress = this.store.createRecord('shippingAddress')
            shippingAddress.set('country', region);

            const controller = this.get('controllers.design/checkout');
            controller.set('model', controller.store.createRecord('printRequest', {
                b2b_id: data.b2b_id,
                customer_details: {
                    name: data.name
                },
                design: this.get('model'),
                locale: this.get('model').get('locale'),
                shippingAddress: shippingAddress
            }));

            this.send('checkout');
        },

        checkout: function () {
            if (this.get('model.isDirty')) {
                this.get('model').save().then(() => {
                    this.transitionToRoute('design.checkout');
                });
            } else {
                this.transitionToRoute('design.checkout');
            }

        },

        startNewDesign: function () {
            this.replaceRoute('design.selector.startNewDesign');
        },

        openSelectorSubmitDesignModal() {
            this.set('selectorSubmitDesignModalOpen', true);
        },

        saveDesign: function () {
            if (this.get('model.isDirty')) {  // TODO: this is probably not in use anymore
                this.get('model').save().then(() => {
                    this.replaceRoute('design.selector.saveToEmail');
                });
            } else {
                this.replaceRoute('design.selector.saveToEmail');
            }
        },

        changeCurrency: function (currencyCode) {
            var c = this.store.all('currency').filterBy('code', currencyCode).get('firstObject');

            if (!c) {
                logger.error('NonexistentCurrencyError', 'User tried to change to a non-existent currency "' + currencyCode + '"');
                return;
            }

            this.set('model.currency', c);
            this.get('controllers.design').startSaveTimerIfNeeded(5000);
        },

        closeSettingsMenu: function () {
            this.set('settingsMenuOpen', false);
        },

        closeUserMenu: function () {
            this.set('userMenuOpen', false);
        },

        closeComingSoonModal() {
            this.set('comingSoonModalOpen', false);
        },

        closeSubmitDesignModal() {
            this.set('submitDesignModalOpen', false);
        },

        openComingSoonModal(subject, title, subtitle) {
            this.set('comingSoonModalSubject', subject || '');
            this.set('comingSoonModalTitle', title || '');
            this.set('comingSoonModalSubtitle', subtitle || '');
            this.set('comingSoonDesign', this.get('store').all('design').get('firstObject'));
            this.set('comingSoonModalOpen', true);
        },

        openSubmitDesignModal() {
            this.set('submitDesignModalOpen', true);
        },

        openAuthModal() {
            this.set('authModalOpen', true);
        },

        closeAuthModal() {
            this.set('authModalOpen', false);
        },

        closeMenus() {
            this.send('closeSettingsMenu');
            this.send('closeUserMenu');
            this.send('closeComingSoonModal');
            this.send('closeSubmitDesignModal');
            this.send('closeAuthModal');
        }
    }
});
