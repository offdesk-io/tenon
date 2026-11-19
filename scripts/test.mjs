/* Render tests against the built files, so they check what a consumer
   installs rather than the source: `npm run build` first, which `npm test`
   does. Server rendering is enough for markup and needs no browser. Each
   component that wants a test gets its own `describe` here until there are
   enough of them to want a runner. */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppHeader } from '../dist/tenon-react.js';

const css = readFileSync(new URL('../dist/tenon-react.css', import.meta.url), 'utf8');
const render = (props) => renderToStaticMarkup(h(AppHeader, props));

describe('AppHeader signOut', () => {
  it('draws no form without it', () => {
    const html = render({ actions: h('button', null, 'New') });
    assert.doesNotMatch(html, /<form/);
    assert.doesNotMatch(html, /Sign out/);
  });

  it('posts to /auth/logout from a small ghost submit button', () => {
    const html = render({ signOut: true });
    assert.match(html, /<form class="tenon-app-header__sign-out" method="post" action="\/auth\/logout">/);
    assert.match(html, /<button type="submit" class="tenon-button tenon-button--ghost tenon-button--sm">Sign out<\/button>/);
  });

  it('takes another action', () => {
    assert.match(render({ signOut: { action: '/logout' } }), /action="\/logout"/);
  });

  it('falls back to /auth/logout when the object has no action', () => {
    assert.match(render({ signOut: {} }), /action="\/auth\/logout"/);
  });

  it('draws nothing for false', () => {
    assert.doesNotMatch(render({ signOut: false, actions: 'x' }), /<form/);
  });

  it('sits last in the actions, after whatever the app passes', () => {
    const html = render({ actions: h('button', { id: 'new' }, 'New'), signOut: true });
    const actions = html.match(/<div class="tenon-app-header__actions">(.*)<\/div><\/header>$/)?.[1];
    assert.ok(actions, 'the actions box is the header\'s last child');
    assert.ok(actions.indexOf('id="new"') < actions.indexOf('<form'), 'New before Sign out');
    assert.match(actions, /<\/form>$/);
  });
});

describe('the app page', () => {
  it('paints the recessed surface from tenon-react.css', () => {
    assert.match(css, /:root \.tenon-app-page\s*\{\s*background:\s*var\(--tenon-background-sunken\)/);
  });

  it('sets the bar\'s box sizing, floor and text style itself', () => {
    const rule = css.match(/\.tenon-app-header\s*\{([^}]*)\}/)?.[1] ?? '';
    for (const prop of ['box-sizing', 'min-height', 'font-family', 'font-size', 'line-height', 'position', 'background', 'border-bottom']) {
      assert.match(rule, new RegExp(`(^|;|\\s)${prop}\\s*:`), `.tenon-app-header sets ${prop}`);
    }
  });
});
