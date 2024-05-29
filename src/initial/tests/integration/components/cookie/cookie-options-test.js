import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('cookie/cookie-options', 'Integration | Component | cookie/cookie options', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{cookie/cookie-options}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#cookie/cookie-options}}
      template block text
    {{/cookie/cookie-options}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
