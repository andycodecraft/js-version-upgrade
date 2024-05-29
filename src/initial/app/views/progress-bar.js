import Ember from 'ember';
import config from '../config/environment';

export default Ember.View.extend({
    templateName: 'progress-bar',

    interviewClass: '',
    designClass: '',
    checkoutClass: '',

    isB2BSite: config.b2b,

    didInsertElement: function () {
        this._super();
        this.updateProgressBar();
    },

    updateProgressBar: function () {

        if (this.get('controller.controllers.progressBar.isProgressBarVisible')) {
            this.set('isVisible', false);
        } else {

            this.set('isVisible', true);

            ['interview', 'design', 'checkout'].forEach(function (stage) {

                if (this.get('controller.controllers.progressBar.' + stage)) {
                    this.set(stage + 'Class', 'rs-stage-active');
                } else {
                    this.set(stage + 'Class', '');
                }
            }.bind(this));
        }

    }.observes('controller.controllers.progressBar.interview', 'controller.controllers.progressBar.design', 'controller.controllers.progressBar.checkout', 'controller.controllers.progressBar.isProgressBarVisible')
});
