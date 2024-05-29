import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cookie/terms-privacy-popup', 'Integration | Component | cookie/terms privacy popup', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{cookie/terms-privacy-popup}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#cookie/terms-privacy-popup}}
      template block text
    {{/cookie/terms-privacy-popup}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
