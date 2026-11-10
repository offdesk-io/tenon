/// <reference types="vite/client" />
import type { CSSProperties } from 'react';
import built from '../../dist/tenon.tokens.json';
import themeList from '../../tokens/themes.json';
import typography from '../../tokens/semantic/typography.json';

/* The token pages read the build's resolved file for every value, and the
   source token files only for what the build drops: which primitive a
   semantic token aliases, and its description. Nothing here is typed by
   hand, so `npm run tokens` is all it takes for the pages to follow a change. */

/* The theme list is the build's own, tokens/themes.json, so a page that
   paints every theme side by side gains a column when a theme is added. */
export type ThemeName = string;
export const THEMES: ThemeName[] = themeList.themes.map((t) => t.name);
const SCHEME: Record<ThemeName, string> = Object.fromEntries(themeList.themes.map((t) => [t.name, t.colorScheme]));

export type TextStyle = Record<string, string>;

interface Built {
  $built: string;
  primitives: Record<string, string>;
  shared: Record<string, string | TextStyle>;
  themes: Record<ThemeName, Record<string, string>>;
  themeTypography: Partial<Record<ThemeName, Record<string, TextStyle>>>;
  themeRadius: Partial<Record<ThemeName, Record<string, string>>>;
}

export const tokens = built as unknown as Built;

interface SourceNode { $value: unknown; $description?: string }

function flatten(tree: Record<string, unknown>, prefix = ''): Record<string, SourceNode> {
  const out: Record<string, SourceNode> = {};
  for (const [k, v] of Object.entries(tree)) {
    if (k.startsWith('$') || !v || typeof v !== 'object') continue;
    const path = prefix ? `${prefix}.${k}` : k;
    if ('$value' in v) out[path] = v as SourceNode;
    else Object.assign(out, flatten(v as Record<string, unknown>, path));
  }
  return out;
}

/* The build hoists the `color` group away, so background.default rather
   than color.background.default. The same is done here so the keys match. */
const hoist = ({ color, ...rest }: Record<string, unknown>) =>
  flatten({ ...(color as Record<string, unknown>), ...rest });

/* Every per-theme source file, keyed by theme name: color.<name>.json and
   the optional typography.<name>.json and radius.<name>.json. */
function byTheme(files: Record<string, unknown>, flat: (tree: Record<string, unknown>) => Record<string, SourceNode>) {
  const out: Record<ThemeName, Record<string, SourceNode>> = {};
  for (const [path, tree] of Object.entries(files)) {
    const name = path.match(/\.([^./]+)\.json$/)?.[1];
    if (name) out[name] = flat(tree as Record<string, unknown>);
  }
  return out;
}
const sources = byTheme(import.meta.glob('../../tokens/semantic/color.*.json', { eager: true, import: 'default' }), hoist);
const textSources = byTheme(import.meta.glob('../../tokens/semantic/typography.*.json', { eager: true, import: 'default' }), (t) => flatten(t));
const radiusSources = byTheme(import.meta.glob('../../tokens/semantic/radius.*.json', { eager: true, import: 'default' }), (t) => flatten(t));
const sharedSource = flatten(typography);

const ALIAS = /^\{([^}]+)\}$/;
const aliasOf = (v: unknown) => (typeof v === 'string' ? v.match(ALIAS)?.[1] : undefined);

/** The primitive a theme token aliases, `color.blue.550`, or undefined for a literal. */
export const themeAlias = (theme: ThemeName, key: string) => aliasOf(sources[theme]?.[key]?.$value);

export const themeDescription = (key: string) => sources.light[key]?.$description;

/** A shared token's alias, or for a text style, one alias per part. Given a
    theme, the alias of that theme's replacement instead. */
export function sharedAlias(key: string, theme?: ThemeName): string | Record<string, string | undefined> | undefined {
  const node = theme ? (textSources[theme]?.[key] ?? radiusSources[theme]?.[key]) : sharedSource[key];
  if (!node) return undefined;
  if (node.$value && typeof node.$value === 'object') {
    return Object.fromEntries(Object.entries(node.$value).map(([k, v]) => [k, aliasOf(v)]));
  }
  return aliasOf(node.$value);
}

export const sharedDescription = (key: string) =>
  sharedSource[key]?.$description
  ?? (typography as unknown as Record<string, { $description?: string }>)[key]?.$description;

/** Drops the group from an alias for display: color.blue.550 reads blue.550. */
export const shortAlias = (alias?: string) => alias?.replace(/^(color|typography|dimension)\./, '');

export const isTextStyle = (v: string | TextStyle): v is TextStyle => typeof v === 'object';

/* A text style from the shared file uses the DTCG part names, one from a
   theme file uses the CSS var suffixes the build writes. Both come out as
   the latter, which is what the page shows. */
const PARTS: Record<string, string> = {
  fontFamily: 'family', fontSize: 'size', fontWeight: 'weight',
  lineHeight: 'line-height', letterSpacing: 'letter-spacing',
};
export const textParts = (style: TextStyle): TextStyle =>
  Object.fromEntries(Object.entries(style).map(([k, v]) => [PARTS[k] ?? k, v]));

export const textCss = (style: TextStyle): CSSProperties => {
  const p = textParts(style);
  return {
    fontFamily: p.family, fontSize: p.size, fontWeight: p.weight as CSSProperties['fontWeight'],
    lineHeight: p['line-height'], letterSpacing: p['letter-spacing'],
  };
};

export const cssName = (path: string) => `--tenon-${path.replace(/\./g, '-')}`;

/* Every semantic var a theme defines, plus its text styles, as inline custom
   properties. Set on a wrapper, they win over :root for everything inside it,
   so a panel shows a theme whatever the toolbar is set to, and Tenon's own
   components inside it follow. The build's CSS cannot do this by itself:
   light lives on :root and every theme that is not automatic only under
   :root[data-theme="<name>"]. Text styles come along only when asked for, so
   a table of swatches keeps one type size across its columns. A theme's
   radii always come along, since they cost a swatch nothing. */
export function themeScope(theme: ThemeName, withText = false): CSSProperties {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens.themes[theme])) vars[cssName(k)] = v;
  if (withText) Object.assign(vars, themeText(theme));
  Object.assign(vars, themeRadius(theme));
  return { ...vars, colorScheme: SCHEME[theme] } as CSSProperties;
}

/* Every radius, the shared value with the theme's replacements over it, so
   a panel never shows the toolbar theme's radii in place of its own. */
function themeRadius(theme: ThemeName) {
  const vars: Record<string, string> = {};
  for (const [k, v] of Object.entries(tokens.shared)) if (k.startsWith('radius.') && !isTextStyle(v)) vars[cssName(k)] = v;
  for (const [k, v] of Object.entries(tokens.themeRadius?.[theme] ?? {})) vars[cssName(k)] = v;
  return vars;
}

function themeText(theme: ThemeName) {
  const vars: Record<string, string> = {};
  const text: Record<string, TextStyle> = {};
  for (const [k, v] of Object.entries(tokens.shared)) if (isTextStyle(v)) text[k] = textParts(v);
  Object.assign(text, tokens.themeTypography[theme] ?? {});
  for (const [k, parts] of Object.entries(text)) {
    for (const [part, v] of Object.entries(parts)) vars[`${cssName(k)}-${part}`] = v;
  }
  return vars;
}

/** Keys of one record grouped by their first segment, in file order. */
export function groupBy(keys: string[], depth = 1) {
  const groups = new Map<string, string[]>();
  for (const k of keys) {
    const g = k.split('.').slice(0, depth).join('.');
    groups.set(g, [...(groups.get(g) ?? []), k]);
  }
  return groups;
}

export const px = (v: string) => parseFloat(v);

/** The theme names as a sentence: light, dark and 1984. */
export const themeNames = THEMES.length > 1
  ? `${THEMES.slice(0, -1).join(', ')} and ${THEMES[THEMES.length - 1]}`
  : THEMES.join('');
