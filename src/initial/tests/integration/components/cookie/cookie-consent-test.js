import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cookie/cookie-consent', 'Integration | Component | cookie/cookie consent', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{cookie/cookie-consent}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#cookie/cookie-consent}}
      template block text
    {{/cookie/cookie-consent}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
