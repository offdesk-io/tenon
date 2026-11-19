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

  it('sets the bar\'s box sizing, height and text style itself', () => {
    const rule = css.match(/\.tenon-app-header\s*\{([^}]*)\}/)?.[1] ?? '';
    for (const prop of ['box-sizing', 'height', 'font-family', 'font-size', 'line-height', 'position', 'background', 'border-bottom']) {
      assert.match(rule, new RegExp(`(^|;|\\s)${prop}\\s*:`), `.tenon-app-header sets ${prop}`);
    }
  });
});

/* No browser here, so the height is checked as arithmetic: the custom
   property's sum over the token values in tenon.css, and a desktop rule that
   leaves no padding or wrap for content to grow the bar with. */
describe('the bar height', () => {
  const tokens = readFileSync(new URL('../dist/tenon.css', import.meta.url), 'utf8');
  const px = (name) => Number(tokens.match(new RegExp(`--${name}:\\s*([\\d.]+)px`))?.[1]);
  const desktop = css.match(/\.tenon-app-header\s*\{([^}]*)\}/)?.[1] ?? '';
  const decl = (rule, prop) => rule.match(new RegExp(`(?:^|;|\\s)${prop}\\s*:\\s*([^;]+)`))?.[1].trim();

  it('is 53px, summed from the tokens it names', () => {
    const sum = css.match(/--tenon-app-header-height:\s*calc\(([^;}]+)\)\s*[;}]/)?.[1];
    assert.ok(sum, '--tenon-app-header-height is a calc()');
    const value = sum.replace(/var\(--([\w-]+)\)/g, (_, n) => String(px(n)));
    assert.match(value, /^[\d.\s+*]+$/, `every token resolved: ${value}`);
    assert.equal(Function(`return ${value}`)(), 53);
  });

  it('is fixed at desktop width, one row, with no vertical padding', () => {
    assert.equal(decl(desktop, 'height'), 'var(--tenon-app-header-height)');
    assert.equal(decl(desktop, 'min-height'), undefined);
    assert.equal(decl(desktop, 'max-height'), undefined);
    assert.equal(decl(desktop, 'flex-wrap'), 'nowrap');
    assert.equal(decl(desktop, 'align-items'), 'center');
    assert.match(decl(desktop, 'padding'), /^0\s/);
  });

  it('holds a 33.6px search box, Binder\'s, without overflow', () => {
    const inside = 53 - px('tenon-dimension-012');
    assert.ok(33.6 <= inside, `${inside}px inside the rule`);
  });

  it('grows to two rows only below 768px, never under the desktop height', () => {
    const phone = css.match(/@media\s*\((?:max-width:\s*767px|width\s*<=\s*767px)\)\s*\{\s*\.tenon-app-header\s*\{([^}]*)\}/)?.[1] ?? '';
    assert.equal(decl(phone, 'height'), 'auto');
    assert.equal(decl(phone, 'min-height'), 'var(--tenon-app-header-height)');
    assert.equal(decl(phone, 'flex-wrap'), 'wrap');
  });
});
