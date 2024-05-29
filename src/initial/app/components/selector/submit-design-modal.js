import Ember from 'ember';

export default Ember.Component.extend({
    hasSubmitted: false,
    hasError: false,
    store: Ember.inject.service(),
    designId: Ember.computed.alias('designModel.id'),
    validForm: Ember.computed('isDealerCodeValid', 'isCustomerNameValid', function () {
        return (
            this.get('isDealerCodeValid') &&
            this.get('isCustomerNameValid')
        );
    }),
    init(){
        this._super(arguments);
    },
    showInvalidFields(){
        this.set('nameValid', !!this.get('isDealerCodeValid'));
        this.set('emailValid', !!this.get('isCustomerNameValid'));
    },
    actions: {
        closeModal () {
            this.set('modalOpen', false);
        },
        noop () {
        },
        submit () {
            if (this.get('validForm')) {
                this.sendAction('action', {
                    b2b_id: this.get('dealerCode'),
                    name: this.get('customerName')
                });
            } else {
                this.showInvalidFields();
            }
        }
    }
});
