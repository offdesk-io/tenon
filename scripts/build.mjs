/* Reads the token JSON, checks it, and writes dist/.
   Run: node scripts/build.mjs   (add --quiet to drop the contrast table)

   Eight checks run before anything is written, and any of them failing
   stops the build:
     1. tokens/themes.json is a list the build can write: light first, light
        and dark the only automatic themes, a colour file for each
     2. theme parity, every theme in tokens/themes.json holds light's key set
     3. every {alias} resolves to something that exists
     4. no semantic token aliases another semantic token
     5. a theme's typography file only replaces text styles the shared file
        has, and gives all five parts of each
     6. a theme's radius file only replaces radii the shared file has, with
        a dimension
     7. every font list is a list of Google Fonts families, and no theme
        loads a family tenon.css already loads
     8. no component CSS reads a colour primitive, and none names a font
        family or a weight Inter is not loaded at
     9. every --tenon- name a component reads is one this build emits
   Parity is the one that matters. A stylesheet had --accent missing from
   its dark block for months and nothing said a word, because a hand-written
   stylesheet has no way to know a key is absent.

   A tenth, contrast, reports and does not fail. Some tokens are meant to
   sit below 4.5:1 and the token file says which.
   ------------------------------------------------------------------- */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { contrast } from './color.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const QUIET = process.argv.includes('--quiet');
const PREFIX = '--tenon';

const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

/* Stamped into both outputs. A copy of tenon.css vendored into a repo that
   cannot run npm has no other way to say which version it is, and a stale
   one is otherwise indistinguishable from a current one. */
const { version } = read('package.json');
const STAMP = `Tenon v${version}, built ${new Date().toISOString().slice(0, 10)}`;
const strip = (o) => Object.fromEntries(Object.entries(o).filter(([k]) => !k.startsWith('$')));

const primitives = {
  ...strip(read('tokens/primitive/color.json')),
  ...strip(read('tokens/primitive/dimension.json')),
  ...strip(read('tokens/primitive/typography.json')),
};
const shared = strip(read('tokens/semantic/typography.json'));
/* The `color` group is hoisted away here rather than left in the path.
   Its children are already named background / text / icon / stroke, so
   keeping it would spell --tenon-color-background-default, which says
   "colour" twice and reads nothing like the primitive it is meant to be
   told apart from. Primitives keep theirs: --tenon-color-blue-600. */
const hoistColor = ({ color = {}, ...rest }) => ({ ...color, ...rest });

/* The theme list is a file of its own because Storybook's switch and token
   pages read it too. Light and dark are the automatic pair and keep the
   selectors they have always had. Every other theme gets
   :root[data-theme="<name>"] and nothing else, so no selector is typed by
   hand: a bare [data-theme] would lose to the automatic dark rule on a
   system set to dark, which is why :root is there. */
const THEMES = read('tokens/themes.json').themes;
const MANUAL = THEMES.filter((t) => !t.automatic);
const themeErrors = [];
const auto = THEMES.filter((t) => t.automatic).map((t) => t.name);
if (THEMES[0]?.name !== 'light' || auto.join() !== 'light,dark') {
  themeErrors.push(`themes.json: light must come first, and light and dark must be the only automatic themes (automatic: ${auto.join(', ') || 'none'})`);
}
for (const t of THEMES) {
  if (!['light', 'dark'].includes(t.colorScheme)) themeErrors.push(`themes.json: ${t.name} needs a colorScheme of light or dark`);
  if (!/^[a-z0-9-]+$/.test(t.name)) themeErrors.push(`themes.json: ${t.name} is not a name a data-theme attribute and a file name can both carry`);
  else if (!existsSync(join(ROOT, `tokens/semantic/color.${t.name}.json`))) themeErrors.push(`themes.json: ${t.name} has no tokens/semantic/color.${t.name}.json`);
}
if (themeErrors.length) {
  console.error('Build failed.\n');
  for (const e of themeErrors) console.error(`  ${e}`);
  process.exit(1);
}
const themes = Object.fromEntries(
  THEMES.map((t) => [t.name, hoistColor(strip(read(`tokens/semantic/color.${t.name}.json`)))])
);

/* ---- flatten ---------------------------------------------------------- */

function flatten(tree, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith('$')) continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && '$value' in v) out[path] = v;
    else if (v && typeof v === 'object') Object.assign(out, flatten(v, path));
  }
  return out;
}

const flatPrimitives = flatten(primitives);
const flatShared = flatten(shared);
const flatThemes = Object.fromEntries(
  Object.entries(themes).map(([n, t]) => [n, flatten(t)])
);

/* A theme may carry its own text styles in tokens/semantic/typography.<theme>.json,
   and its own radii in tokens/semantic/radius.<theme>.json. Each replaces the
   shared token of the same name inside that theme's block, and one it leaves
   out keeps the shared value, so either file can be partial. */
const overrides = (kind) => {
  const out = {};
  for (const { name } of THEMES) {
    const file = `tokens/semantic/${kind}.${name}.json`;
    if (existsSync(join(ROOT, file))) out[name] = flatten(strip(read(file)));
  }
  return out;
};
const flatTextThemes = overrides('typography');
const flatRadiusThemes = overrides('radius');

/* Web fonts, declared beside the text styles that use them, under
   $extensions.tenon.fonts. The shared file's list goes into tenon.css, so
   every consumer gets it. A theme's list gets a stylesheet of its own,
   dist/fonts/<theme>.css, because an @import cannot be made conditional on
   [data-theme] and one that sat in tenon.css would make every app download
   every theme's fonts. The theme files are found by name rather than taken
   from the themes above, so a new theme's fonts need no edit here. */
const fontsOf = (file) => read(file).$extensions?.tenon?.fonts;
const fontLists = { 'typography.json': fontsOf('tokens/semantic/typography.json') };
const themeFonts = {};
for (const f of readdirSync(join(ROOT, 'tokens/semantic')).sort()) {
  const m = f.match(/^typography\.(.+)\.json$/);
  if (!m) continue;
  fontLists[f] = themeFonts[m[1]] = fontsOf(`tokens/semantic/${f}`);
  if (themeFonts[m[1]] === undefined) delete themeFonts[m[1]];
}
const baseFonts = Array.isArray(fontLists['typography.json']) ? fontLists['typography.json'] : [];

/* ---- checks ----------------------------------------------------------- */

const errors = [];

const lightKeys = Object.keys(flatThemes.light).sort();
for (const { name } of THEMES.slice(1)) {
  const keys = Object.keys(flatThemes[name]).sort();
  for (const k of lightKeys) if (!keys.includes(k)) errors.push(`${name} is missing ${k}`);
  for (const k of keys) if (!lightKeys.includes(k)) errors.push(`light is missing ${k}, which ${name} has`);
}

const ALIAS = /^\{([^}]+)\}$/;

function resolve(value, seen = []) {
  if (typeof value !== 'string') return value;
  const m = value.match(ALIAS);
  if (!m) return value;
  const target = m[1];
  if (seen.includes(target)) {
    errors.push(`alias loop: ${[...seen, target].join(' -> ')}`);
    return value;
  }
  const node = flatPrimitives[target] ?? flatShared[target];
  if (!node) {
    errors.push(`alias {${target}} points at nothing`);
    return value;
  }
  return resolve(node.$value, [...seen, target]);
}

/* The theme files are covered by the primitive-only rule below, which an
   alias to nothing fails as well. Primitives and the shared file are not,
   and resolve() is otherwise only reached while the resolved copy is written,
   which is after the last chance to stop. So both are walked here. */
for (const flat of [flatPrimitives, flatShared]) {
  for (const node of Object.values(flat)) {
    const parts = node.$type === 'typography' ? Object.values(node.$value) : [node.$value];
    for (const v of parts) resolve(v);
  }
}

/* A semantic aliasing another semantic is the chain that makes a rename
   break in two places instead of one. */
for (const [theme, flat] of Object.entries(flatThemes)) {
  for (const [key, node] of Object.entries(flat)) {
    const m = typeof node.$value === 'string' && node.$value.match(ALIAS);
    if (m && !(m[1] in flatPrimitives)) {
      errors.push(`${theme}: ${key} aliases {${m[1]}}, which is not a primitive`);
    }
  }
}

/* Light shares :root with the shared styles and radii, so a light file
   would only be a second copy of the shared one. Changing the shared file is
   the way to change light. */
const TEXT_PARTS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
if (flatTextThemes.light) errors.push('typography.light.json exists, but light is the shared styles: change typography.json instead');
if (flatRadiusThemes.light) errors.push('radius.light.json exists, but light is the shared radii: change typography.json instead');
for (const [theme, flat] of Object.entries(flatTextThemes)) {
  for (const [key, node] of Object.entries(flat)) {
    if (flatShared[key]?.$type !== 'typography') {
      errors.push(`${theme} typography: ${key} is not a text style in the shared file`);
      continue;
    }
    for (const part of TEXT_PARTS) {
      if (!(part in node.$value)) errors.push(`${theme} typography: ${key} is missing ${part}`);
    }
    for (const [part, val] of Object.entries(node.$value)) {
      const m = typeof val === 'string' && val.match(ALIAS);
      if (m && !(m[1] in flatPrimitives)) {
        errors.push(`${theme} typography: ${key}.${part} aliases {${m[1]}}, which is not a primitive`);
      }
    }
  }
}

/* The same rule for radius: a theme may only rename a pick the shared file
   already makes, so a component reading --tenon-radius-lg finds it in every
   theme, and a new radius name goes in the shared file first. */
for (const [theme, flat] of Object.entries(flatRadiusThemes)) {
  for (const [key, node] of Object.entries(flat)) {
    if (!key.startsWith('radius.') || flatShared[key]?.$type !== 'dimension') {
      errors.push(`${theme} radius: ${key} is not a radius in the shared file`);
      continue;
    }
    if (node.$type !== 'dimension') errors.push(`${theme} radius: ${key} has $type ${node.$type}, not dimension`);
    const m = typeof node.$value === 'string' && node.$value.match(ALIAS);
    if (m && !(m[1] in flatPrimitives)) {
      errors.push(`${theme} radius: ${key} aliases {${m[1]}}, which is not a primitive`);
    } else if (m && flatPrimitives[m[1]].$type !== 'dimension') {
      errors.push(`${theme} radius: ${key} aliases {${m[1]}}, which is a ${flatPrimitives[m[1]].$type} rather than a dimension`);
    } else if (!m && !(node.$value && typeof node.$value === 'object' && 'value' in node.$value && 'unit' in node.$value)) {
      errors.push(`${theme} radius: ${key} is neither an alias nor a dimension with a value and a unit`);
    }
  }
}

/* A family is css2's `family=` value: a name, then optionally an axis list
   such as `:wght@400;700`. Spaces in the name are fine and become `+`. */
const FAMILY = /^[A-Za-z0-9 ]+(:[a-z,]+@[0-9.;,]+)?$/;
const familyName = (f) => f.split(':')[0];
for (const [where, fonts] of Object.entries(fontLists)) {
  if (fonts === undefined) continue;
  if (!Array.isArray(fonts) || !fonts.length) { errors.push(`${where}: $extensions.tenon.fonts is not a list of families`); continue; }
  for (const f of fonts) if (typeof f !== 'string' || !FAMILY.test(f)) errors.push(`${where}: font ${JSON.stringify(f)} is not a Google Fonts family`);
}
const baseNames = new Set(baseFonts.map(familyName));
for (const [theme, fonts] of Object.entries(themeFonts)) {
  if (!Array.isArray(fonts)) continue;
  for (const f of fonts) {
    if (typeof f === 'string' && baseNames.has(familyName(f))) errors.push(`typography.${theme}.json: ${familyName(f)} is already loaded by tenon.css`);
  }
}

/* A text style's case is one of the four values text-transform and Figma's
   text case share. A theme replacing a style in capitals has to say so
   again, since its file replaces the style whole. */
const caseOf = (node) => node.$extensions?.tenon?.textCase;
const CASES = new Set(['uppercase', 'lowercase', 'capitalize', 'none']);
for (const [where, flat] of [['typography.json', flatShared], ...Object.entries(flatTextThemes).map(([t, f]) => [`typography.${t}.json`, f])]) {
  for (const [key, node] of Object.entries(flat)) {
    const c = caseOf(node);
    if (c !== undefined && !CASES.has(c)) errors.push(`${where}: ${key} has textCase ${JSON.stringify(c)}, not one of ${[...CASES].join(', ')}`);
    if (where !== 'typography.json' && caseOf(flatShared[key] ?? {}) && c === undefined) {
      errors.push(`${where}: ${key} replaces a style set in capitals and says nothing about its case`);
    }
  }
}

/* Component CSS may read the dimension scale directly, because that scale
   has one tier on purpose. It may not read a colour primitive: a component
   naming --tenon-color-blue-600 is a component that will not follow a
   theme, and it is the one mistake the two-tier split exists to prevent. */
function cssFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = join(dir, e.name);
    return e.isDirectory() ? cssFiles(full) : e.name.endsWith('.css') ? [full] : [];
  });
}
/* Local custom properties a component sets on its own element from a prop.
   They are not tokens and will not be found in the built CSS, which is the
   whole reason this list has to be written down. */
const LOCALS = new Set(['--tenon-card-accent', '--tenon-tag-colour', '--tenon-column-tone', '--tenon-column-drop', '--tenon-modal-width', '--tenon-dropline-color', '--tenon-reorder-gap', '--tenon-toggle-colour']);

const componentCss = cssFiles(join(ROOT, 'src')).map((f) => [f, readFileSync(f, 'utf8')]);

for (const [file, text] of componentCss) {
  for (const m of text.matchAll(/var\(\s*(--tenon-color-[a-z0-9-]+)/g)) {
    errors.push(`${file.replace(ROOT + '/', '')} reads the primitive ${m[1]}`);
  }
}

/* Fonts come from the theme and nowhere else. A component or the page layer
   that names a family is one the theme cannot change, and one that asks for
   a weight between the four Inter is loaded at gets a weight the browser
   rounds or fakes, so the two apps that share these styles would draw the
   same label differently. A family is read from a text style's -family var
   or a font-family token, or inherited; a weight is a var or 400 to 700 in
   hundreds. Comments are dropped first so an explanation can name a font. */
const PAGE_CSS = join(ROOT, 'design-md/assets/tn-page.css');
const LOADED_WEIGHTS = new Set(['400', '500', '600', '700', 'normal', 'bold', 'inherit']);
for (const [file, raw] of [...componentCss, [PAGE_CSS, readFileSync(PAGE_CSS, 'utf8')]]) {
  const text = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  const where = file.replace(ROOT + '/', '');
  for (const m of text.matchAll(/(?<![-\w])font-family\s*:\s*([^;}]+)/g)) {
    const v = m[1].trim();
    if (!/^(inherit|var\(--tenon-(text-[a-z0-9-]+-family|font-family-[a-z0-9-]+)\)(,\s*inherit)?)$/.test(v)) {
      errors.push(`${where} sets font-family: ${v}, rather than reading a text style's family`);
    }
  }
  for (const m of text.matchAll(/(?<![-\w])font\s*:\s*([^;}]+)/g)) {
    if (m[1].trim() !== 'inherit') errors.push(`${where} sets font: ${m[1].trim()}; only font: inherit is allowed`);
  }
  for (const m of text.matchAll(/(?<![-\w])font-weight\s*:\s*([^;}]+)/g)) {
    const v = m[1].trim();
    if (!v.startsWith('var(') && !LOADED_WEIGHTS.has(v)) errors.push(`${where} sets font-weight: ${v}, which Inter is not loaded at`);
  }
}

if (errors.length) {
  console.error('Build failed.\n');
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

/* ---- css -------------------------------------------------------------- */

const cssName = (path) => `${PREFIX}-${path.replace(/\./g, '-').replace(/\s+/g, '-')}`;

function cssValue(node, { literal = false } = {}) {
  const v = node.$value;
  if (typeof v === 'string') {
    const m = v.match(ALIAS);
    if (m) return literal ? cssValue({ $value: resolve(v) }, { literal }) : `var(${cssName(m[1])})`;
    return v;
  }
  if (Array.isArray(v)) {
    if (node.$type === 'fontFamily') return v.map((f) => (/\s/.test(f) ? `"${f}"` : f)).join(', ');
    if (node.$type === 'shadow') {
      return v.map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(', ');
    }
  }
  if (v && typeof v === 'object' && 'value' in v) return `${v.value}${v.unit ?? ''}`;
  return String(v);
}

const block = (entries, indent = '  ') =>
  entries.map(([k, v]) => `${indent}${k}: ${v};`).join('\n');

const primitiveVars = Object.entries(flatPrimitives)
  .filter(([, n]) => n.$type !== 'typography')
  .map(([p, n]) => [cssName(p), cssValue(n)]);

/* A composite text style becomes one var per part plus a shorthand, since
   `font:` cannot carry letter-spacing and a class is the only place the
   five parts sit together.

   A style set in capitals has a sixth, its case, which DTCG's typography
   type has no part for, so it rides in $extensions.tenon.textCase and comes
   out as -case. Figma's text styles carry case too, so it is part of the
   style there as well, and the resolved copy below writes it beside the
   other five. */
const partVars = (path, node, opts) => [
  ...Object.entries({
    family: node.$value.fontFamily, size: node.$value.fontSize, weight: node.$value.fontWeight,
    'line-height': node.$value.lineHeight, 'letter-spacing': node.$value.letterSpacing,
  }).map(([part, val]) => [`${cssName(path)}-${part}`, cssValue({ $value: val }, opts)]),
  ...(caseOf(node) ? [[`${cssName(path)}-case`, caseOf(node)]] : []),
];

/* A text style whose name a component already uses as its own class. The
   vars are still written, and the component reads them, but a .tenon-stat
   text class would put the figure's font on the whole Stat box, and a
   .tenon-tag text class would be a second rule on Tag's own class. */
const OWNED_BY_COMPONENT = new Set(['text.stat', 'text.tag']);

const textVars = [];
const textClasses = [];
for (const [path, node] of Object.entries(flatShared)) {
  if (node.$type !== 'typography') {
    textVars.push([cssName(path), cssValue(node)]);
    continue;
  }
  textVars.push(...partVars(path, node));
  if (OWNED_BY_COMPONENT.has(path)) continue;
  const cls = path.replace(/^text\./, '').replace(/\./g, '-');
  textClasses.push(
    `.tenon-${cls} {\n` +
    `  font-family: var(${cssName(path)}-family);\n` +
    `  font-size: var(${cssName(path)}-size);\n` +
    `  font-weight: var(${cssName(path)}-weight);\n` +
    `  line-height: var(${cssName(path)}-line-height);\n` +
    `  letter-spacing: var(${cssName(path)}-letter-spacing);\n` +
    (caseOf(node) ? `  text-transform: var(${cssName(path)}-case);\n` : '') +
    '}'
  );
}

const themeVars = (name) =>
  Object.entries(flatThemes[name]).map(([p, n]) => [cssName(p), cssValue(n)]);

/* The classes above read these vars, so redefining them inside a theme's
   block restyles every use of the class and every component with no new rule.

   A theme that is not automatic also writes the shared value of anything
   dark replaces and it does not. On a system set to dark the automatic dark
   rule matches under [data-theme="1984"] too, so whatever 1984 left unset
   would come from dark rather than from the shared file. Colour cannot leak
   that way, since parity makes every theme set every colour. */
const MANUAL_NAMES = new Set(MANUAL.map((t) => t.name));
const replaced = (name, own) => {
  const mine = own[name] ?? {};
  if (!MANUAL_NAMES.has(name)) return Object.entries(mine);
  const fill = Object.keys(own.dark ?? {}).filter((k) => !(k in mine)).map((k) => [k, flatShared[k]]);
  return [...Object.entries(mine), ...fill];
};
const themeTextVars = (name) =>
  replaced(name, flatTextThemes).flatMap(([p, n]) => partVars(p, n));
const themeRadiusVars = (name) =>
  replaced(name, flatRadiusThemes).map(([p, n]) => [cssName(p), cssValue(n)]);

const themeBlock = (name, indent = '  ') => {
  const sections = [block(themeVars(name), indent)];
  const text = themeTextVars(name);
  if (text.length) sections.push(`${indent}/* ---- text styles that replace the shared ones ---- */\n${block(text, indent)}`);
  const radii = themeRadiusVars(name);
  if (radii.length) sections.push(`${indent}/* ---- radii that replace the shared ones ---- */\n${block(radii, indent)}`);
  return sections.join('\n\n');
};

const manualBlocks = MANUAL.map((t) => `:root[data-theme="${t.name}"] {
  color-scheme: ${t.colorScheme};
${themeBlock(t.name)}
}
`).join('\n');

const manualList = MANUAL.map((t) => t.name).join(', ');

/* @import has to be the first rule, so it sits above the stamp comment. A
   tool that concatenates CSS files must keep this line at the top of the
   combined file or browsers drop it. */
const fontsUrl = (fonts) =>
  `https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${f.replace(/ /g, '+')}`).join('&')}&display=swap`;
const fontImport = (fonts) => (fonts.length ? `@import url('${fontsUrl(fonts)}');\n` : '');

const css = `${fontImport(baseFonts)}/* ${STAMP}
   Generated by scripts/build.mjs. Do not edit.
   ${primitiveVars.length} primitives, ${lightKeys.length} semantic tokens per theme, ${THEMES.length} themes.

   Light is the default. Dark applies when the system asks for it, unless
   [data-theme="light"] is set, and applies unconditionally under
   [data-theme="dark"]. So a manual toggle needs no rebuild. Every other
   theme (${manualList || 'none today'}) is never automatic: each applies only under
   :root[data-theme="<name>"], written with :root so it outranks the
   automatic dark rule above it on a system set to dark. A theme's own text
   styles and radii, from typography.<name>.json and radius.<name>.json, sit
   at the end of its block and replace the shared ones of the same name. Fonts a theme needs beyond
   ${baseFonts.map(familyName).join(', ') || 'these'} are in dist/fonts/<theme>.css, imported beside this file. */

:root {
  color-scheme: light dark;

  /* ---- primitives. Nothing outside this file should read one. ---- */
${block(primitiveVars)}

  /* ---- shared semantics: type and radius, unless a theme replaces them ---- */
${block(textVars)}

  /* ---- semantics: light ---- */
${block(themeVars('light'))}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${themeBlock('dark', '    ')}
  }
}

[data-theme="dark"] {
${themeBlock('dark')}
}

${manualBlocks}
${textClasses.join('\n\n')}
`;

/* Every --tenon- name a component reads has to be one this build emits.
   A var() naming a token that does not exist falls back silently, or to
   whatever fallback was typed beside it, and looks completely fine. That
   has now happened twice here: --tenon-color-background-default, which
   made the token preview render on browser defaults, and --tenon-text-2xs
   in the column head. Both looked right. */
const emitted = new Set(css.match(/^\s*(--tenon-[a-z0-9-]+):/gm)?.map((l) => l.trim().slice(0, -1)) ?? []);
for (const [file, text] of componentCss) {
  for (const m of text.matchAll(/var\(\s*(--tenon-[a-z0-9-]+)/g)) {
    if (!emitted.has(m[1]) && !LOCALS.has(m[1])) {
      errors.push(`${file.replace(ROOT + '/', '')} reads ${m[1]}, which this build does not emit`);
    }
  }
}
if (errors.length) {
  console.error('Build failed.\n');
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'tenon.css'), css);

/* Emptied first, so a theme whose font list is removed loses its sheet. */
rmSync(join(ROOT, 'dist', 'fonts'), { recursive: true, force: true });
if (Object.keys(themeFonts).length) mkdirSync(join(ROOT, 'dist', 'fonts'));
for (const [theme, fonts] of Object.entries(themeFonts)) {
  writeFileSync(join(ROOT, 'dist', 'fonts', `${theme}.css`), `${fontImport(fonts)}/* ${STAMP}
   Generated by scripts/build.mjs from typography.${theme}.json. Do not edit.
   Fonts the ${theme} theme needs beyond tenon.css's: ${fonts.map(familyName).join(', ')}.
   Import it after tenon.css, only in an app that sets data-theme="${theme}". */
`);
}

/* A fully resolved copy, for the Figma side and for anything that wants
   values rather than references. */
const resolved = {
  $version: version,
  $built: STAMP,
  primitives: Object.fromEntries(
    Object.entries(flatPrimitives).map(([p, n]) => [p, cssValue(n, { literal: true })])
  ),
  shared: Object.fromEntries(
    Object.entries(flatShared).map(([p, n]) =>
      [p, n.$type === 'typography'
        ? Object.fromEntries([
          ...Object.entries(n.$value).map(([k, v]) => [k, cssValue({ $value: v }, { literal: true })]),
          ...(caseOf(n) ? [['textCase', caseOf(n)]] : []),
        ])
        : cssValue(n, { literal: true })])
  ),
  themes: Object.fromEntries(
    Object.entries(flatThemes).map(([t, f]) =>
      [t, Object.fromEntries(Object.entries(f).map(([p, n]) => [p, cssValue(n, { literal: true })]))])
  ),
  themeTypography: Object.fromEntries(
    Object.entries(flatTextThemes).map(([t, f]) =>
      [t, Object.fromEntries(Object.entries(f).map(([p, n]) =>
        [p, Object.fromEntries(partVars(p, n, { literal: true }).map(([k, v]) => [k.replace(`${cssName(p)}-`, ''), v]))]))])
  ),
  themeRadius: Object.fromEntries(
    Object.entries(flatRadiusThemes).map(([t, f]) =>
      [t, Object.fromEntries(Object.entries(f).map(([p, n]) => [p, cssValue(n, { literal: true })]))])
  ),
};
writeFileSync(join(ROOT, 'dist', 'tenon.tokens.json'), JSON.stringify(resolved, null, 2) + '\n');

/* ---- contrast report -------------------------------------------------- */

const rows = [];
for (const { name: theme } of THEMES) {
  const r = resolved.themes[theme];
  const surfaces = { 'bg.default': r['background.default'], 'bg.raised': r['background.raised'] };
  for (const [key, hex] of Object.entries(r)) {
    if (!/^(text|icon)\./.test(key)) continue;
    /* An on-X is never read on a page surface, so measuring it against one
       says nothing. Each is checked against its own fill just below. */
    if (/(on-|inverse)/.test(key)) continue;
    if (!/^#[0-9a-f]{6}$/i.test(hex)) continue;
    const worst = Math.min(...Object.values(surfaces).map((s) => contrast(hex, s)));
    if (worst < 4.5) rows.push({ theme, token: key, hex, 'worst ratio': worst.toFixed(2) });
  }

  /* text.on-X against background.X, which is the only place it is used.
     This pairing is why background.success is one ramp step darker than
     the other four in the light theme. */
  for (const [key, hex] of Object.entries(r)) {
    const m = key.match(/^text\.on-(.+)$/);
    if (!m) continue;
    const fill = r[`background.${m[1]}`];
    if (!fill || !/^#[0-9a-f]{6}$/i.test(hex) || !/^#[0-9a-f]{6}$/i.test(fill)) continue;
    const ratio = contrast(hex, fill);
    if (ratio < 4.5) rows.push({ theme, token: `${key} on background.${m[1]}`, hex, 'worst ratio': ratio.toFixed(2) });
  }

  /* text.X against background.X-subtle, wherever that fill exists. */
  for (const [key, hex] of Object.entries(r)) {
    const m = key.match(/^text\.([a-z]+)$/);
    if (!m) continue;
    const fill = r[`background.${m[1]}-subtle`];
    if (!fill || !/^#[0-9a-f]{6}$/i.test(hex) || !/^#[0-9a-f]{6}$/i.test(fill)) continue;
    const ratio = contrast(hex, fill);
    if (ratio < 4.5) rows.push({ theme, token: `${key} on background.${m[1]}-subtle`, hex, 'worst ratio': ratio.toFixed(2) });
  }

  /* The urgent and soon tags set status.over and status.soon as text on
     background.neutral. */
  for (const key of ['status.over', 'status.soon']) {
    const hex = r[key];
    const fill = r['background.neutral'];
    if (!hex || !fill || !/^#[0-9a-f]{6}$/i.test(hex) || !/^#[0-9a-f]{6}$/i.test(fill)) continue;
    const ratio = contrast(hex, fill);
    if (ratio < 4.5) rows.push({ theme, token: `${key} on background.neutral`, hex, 'worst ratio': ratio.toFixed(2) });
  }
}

console.log(`${STAMP}`);
console.log(`dist/tenon.css               ${primitiveVars.length} primitives, ${lightKeys.length} semantics x ${THEMES.length} themes`);
console.log(`dist/tenon.tokens.json       resolved values`);
for (const [theme, fonts] of Object.entries(themeFonts)) {
  console.log(`${`dist/fonts/${theme}.css`.padEnd(28)} ${fonts.map(familyName).join(', ')}`);
}
console.log(`\nChecks passed: a theme list the build can write, theme parity (${THEMES.map((t) => t.name).join(', ')}),\n               alias targets, no semantic-to-semantic aliases,\n               theme typography files replace only styles that exist, with all five parts,\n               theme radius files replace only radii that exist, with a dimension,\n               font lists name Google Fonts families, none loaded twice,\n               text case one of four values, and restated by a theme that replaces a style in capitals,\n               no component CSS reading a colour primitive, naming a font family or an unloaded weight,\n               every --tenon- name a component reads is one this build emits.`);
if (!QUIET) {
  if (rows.length) {
    console.log(`\n${rows.length} text or icon tokens below 4.5:1 on their own background:`);
    console.table(rows);
  } else {
    console.log('\nEvery text and icon token clears 4.5:1.');
  }
}
