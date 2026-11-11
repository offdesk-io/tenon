/* Generates tokens/primitive/color.json: 17 hues x 19 steps, from one
   anchor hex each. The anchors are the colours an earlier task board already
   used, so the ramps carry that palette rather than replacing it.

   Two curves do the work. LIGHTNESS is a fixed table, identical on every
   hue, which is what makes blue-600 and green-600 the same weight on the
   page. CHROMA is a shape scaled per hue so the anchor reproduces at its
   own position, which is what keeps each ramp looking like the colour it
   came from instead of like a generated pastel.

   Run: node scripts/generate-ramps.mjs
   ------------------------------------------------------------------- */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { hexToRgb, rgbToOklch, oklchToHex, contrast } from './color.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'tokens', 'primitive', 'color.json');

const STEPS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500,
               550, 600, 650, 700, 750, 800, 850, 900, 950];

const LIGHTNESS = [0.975, 0.950, 0.920, 0.885, 0.845, 0.800, 0.755, 0.710,
                   0.665, 0.620, 0.575, 0.530, 0.485, 0.440, 0.395, 0.350,
                   0.300, 0.250, 0.195];

const CHROMA = [0.12, 0.22, 0.34, 0.47, 0.60, 0.72, 0.83, 0.91, 0.97, 1.00,
                1.00, 0.98, 0.94, 0.88, 0.80, 0.71, 0.60, 0.48, 0.36];

/* Anchors. `from` says where the colour came from, and is the reason not
   to touch it casually: changing an anchor moves all 19 of its steps. */
const HUES = {
  neutral: { hex: '#5d636e', from: 'earlier palette --n-500' },
  grey:    { hex: '#9a9a9a', from: 'muted text on the site theme, zero chroma' },
  slate:  { hex: '#55606e', from: 'earlier palette --bucket-10-light' },
  blue:    { hex: '#2f6feb', from: 'earlier palette --blue-500, the accent' },
  indigo:  { hex: '#4550c9', from: 'earlier palette --bucket-8-light' },
  purple:  { hex: '#7c4ddb', from: 'earlier palette --bucket-3-light' },
  plum:    { hex: '#9c3d9c', from: 'new, fills the purple-to-magenta gap' },
  magenta: { hex: '#b1306b', from: 'earlier palette --bucket-5-light' },
  rose:    { hex: '#c23b5e', from: 'new, fills the magenta-to-red gap' },
  red:     { hex: '#c8322f', from: 'earlier palette --red-500' },
  orange:  { hex: '#e0610f', from: 'earlier palette --orange-500' },
  brown:   { hex: '#8a5a2f', from: 'earlier palette --bucket-7-light' },
  amber:   { hex: '#9a6100', from: 'earlier palette --amber-500' },
  yellow:  { hex: '#b38600', from: 'new, fills the amber-to-lime gap' },
  lime:    { hex: '#5a9216', from: 'new, fills the yellow-to-green gap' },
  green:   { hex: '#1f7a45', from: 'earlier palette --green-500' },
  teal:    { hex: '#0f7d93', from: 'earlier palette --bucket-6-light' },
  cyan:    { hex: '#0e8fa8', from: 'new, fills the teal-to-blue gap' },
};

/* Where the anchor's own lightness falls on the table, as a fractional
   index, so its chroma can be read off the same curve the ramp uses. */
function anchorIndex(L) {
  for (let i = 0; i < LIGHTNESS.length - 1; i++) {
    const hi = LIGHTNESS[i], lo = LIGHTNESS[i + 1];
    if (L <= hi && L >= lo) return i + (hi - L) / (hi - lo);
  }
  return L > LIGHTNESS[0] ? 0 : LIGHTNESS.length - 1;
}

const lerp = (arr, i) => {
  const a = Math.floor(i), b = Math.min(a + 1, arr.length - 1);
  return arr[a] + (arr[b] - arr[a]) * (i - a);
};

function ramp(hex) {
  const [, Ca, h] = rgbToOklch(hexToRgb(hex));
  const [La] = rgbToOklch(hexToRgb(hex));
  const idx = anchorIndex(La);
  const scale = Ca / Math.max(lerp(CHROMA, idx), 1e-6);
  return STEPS.map((step, i) => [step, oklchToHex([LIGHTNESS[i], CHROMA[i] * scale, h])]);
}

const primitives = {};
const report = [];

for (const [name, { hex, from }] of Object.entries(HUES)) {
  const group = {
    $description: `Generated from ${hex} (${from}). Do not hand-edit; run scripts/generate-ramps.mjs.`,
  };
  const pairs = ramp(hex);
  for (const [step, value] of pairs) {
    group[String(step)] = { $type: 'color', $value: value };
  }
  primitives[name] = group;

  /* Which step the anchor landed nearest, and the two contrast facts that
     decide whether a hue is usable as text. */
  const nearest = pairs.reduce((best, p) =>
    Math.abs(rgbToOklch(hexToRgb(p[1]))[0] - rgbToOklch(hexToRgb(hex))[0]) <
    Math.abs(rgbToOklch(hexToRgb(best[1]))[0] - rgbToOklch(hexToRgb(hex))[0]) ? p : best);
  const onWhite = pairs.find(([, v]) => contrast(v, '#ffffff') >= 4.5);
  const onDark = [...pairs].reverse().find(([, v]) => contrast(v, '#1c1f25') >= 4.5);
  report.push({
    hue: name,
    anchor: hex,
    'lands at': nearest[0],
    'first 4.5:1 on white': onWhite ? onWhite[0] : 'none',
    'first 4.5:1 on dark': onDark ? onDark[0] : 'none',
  });
}

/* Values that sit outside the ramps. White and black are endpoints, not
   steps, and putting them in the neutral ramp is what makes a "lightest
   neutral" quietly become pure white on one theme. Yellow is the 1984
   theme's accent at full chroma, which no generated step reaches: the
   yellow ramp's lightest steps are cream. The two urgency colours alias a
   ramp step legible as text, so a tag can use them as well as the timeline. */
primitives.base = {
  white:  { $type: 'color', $value: '#ffffff' },
  black:  { $type: 'color', $value: '#000000' },
  yellow: { $type: 'color', $value: '#ffff00', $description: 'Full chroma, outside the yellow ramp. The 1984 theme\'s accent: fills, and text on a dark surface only.' },
  urgent: { $type: 'color', $value: '{color.red.550}', $description: 'In the red ramp, at a step legible as text. Fills the timeline\'s overdue bar and a tag\'s text colour.' },
  soon:   { $type: 'color', $value: '{color.amber.600}', $description: 'In the amber ramp, at a step legible as text. Fills the timeline\'s due-soon bar and a tag\'s text colour.' },
};

/* OFFDESK's brand palette, for the two OFFDESK themes. Each brand colour
   gets a ramp of its own, made the same way as the hues above, so the
   themes' in-between surfaces and greys come from the brand's own colours
   rather than from Tenon's grey. The ramps are named offdesk-<colour> so
   they cannot be mistaken for Tenon's own orange, yellow and blue, and so
   the primitives page draws each as a row of its own.

   The method only lands near an anchor, since every step takes its lightness
   from the fixed table. The brand's hex is the brand, so the step nearest
   the anchor in lightness is pinned to it byte for byte, and its neighbours
   keep their table lightness. Ink has no ramp of its own: it is the dark end
   of Raw steel's, pinned at 950, so the brand's neutrals are one scale from
   steel's lightest tint down to Ink. Source: OFFDESK's brand stylesheet,
   brand/AGENTS/design-md/assets/ofd-brand.css, 5 Nov 2026. */
const BRAND = {
  orange:   { hex: '#e2481c', name: 'Safety orange' },
  yellow:   { hex: '#f2c500', name: 'Signal yellow' },
  blue:     { hex: '#2440a8', name: 'IBM blue' },
  concrete: { hex: '#e7e5e0', name: 'Concrete' },
  steel:    { hex: '#9a9a96', name: 'Raw steel', also: { ink: { step: 950, hex: '#141414', name: 'Ink' } } },
  /* Bucket colours 4 to 10, chosen for OFFDESK's board with Tiago,
     11 Nov 2026. Not in the brand book, which has three colours beside its
     neutrals; these extend it for a board that needs ten buckets. */
  cyan:     { hex: '#1a9bd7', name: 'Blueprint cyan' },
  purple:   { hex: '#6d3fc8', name: 'Radiation purple' },
  magenta:  { hex: '#c21e8a', name: 'Marker magenta' },
  teal:     { hex: '#12877b', name: 'Patina teal' },
  olive:    { hex: '#7f7a1f', name: 'Workwear olive' },
  kraft:    { hex: '#ae8250', name: 'Kraft' },
  pink:     { hex: '#ec6f9f', name: 'Hi-vis pink' },
};
const anchorStep = {};
for (const [key, { hex, name, also = {} }] of Object.entries(BRAND)) {
  const pairs = ramp(hex);
  const [La] = rgbToOklch(hexToRgb(hex));
  const at = LIGHTNESS.reduce((best, L, i) => (Math.abs(L - La) < Math.abs(LIGHTNESS[best] - La) ? i : best), 0);
  const names = { [pairs[at][0]]: name };
  pairs[at] = [pairs[at][0], hex];
  anchorStep[key] = pairs[at][0];
  for (const [extra, pin] of Object.entries(also)) {
    const i = STEPS.indexOf(pin.step);
    pairs[i] = [pin.step, pin.hex];
    names[pin.step] = pin.name;
    anchorStep[extra] = pin.step;
  }
  const pinned = Object.entries(names).map(([step, n]) => `${n} at ${step}`).join(' and ');
  const group = {
    $description: `OFFDESK ${name}, generated from ${hex}, with the brand hex pinned for ${pinned}. Do not hand-edit; run scripts/generate-ramps.mjs.`,
  };
  for (const [step, value] of pairs) {
    group[String(step)] = names[step]
      ? { $type: 'color', $value: value, $description: `${names[step]}, the brand hex.` }
      : { $type: 'color', $value: value };
  }
  primitives[`offdesk-${key}`] = group;
}

/* The brand's colours by name, for the brand roles the themes state. Each
   aliases its ramp's pinned step, so Ink is findable as Ink. Raw steel dark
   is not on the steel ramp (it falls between 700 and 750, and neither is
   within rounding of it), and Ink raised is a value the brand sheet derives
   itself and matches no steel step, so both stay literal. White is base.white, the same #ffffff. */
const at = (key, ramp = key) => `{color.offdesk-${ramp}.${anchorStep[key]}}`;
primitives.offdesk = {
  ink:          { $type: 'color', $value: at('ink', 'steel'), $description: 'Ink. All type, all rules, and the contrast surface. The light theme\'s actions and links.' },
  concrete:     { $type: 'color', $value: at('concrete'), $description: 'Concrete. The default page ground, and type on Ink.' },
  orange:       { $type: 'color', $value: at('orange'), $description: 'Safety orange, the signal. In the themes it marks focus, the selected thing and one chart colour. Never a button or a link.' },
  yellow:       { $type: 'color', $value: at('yellow'), $description: 'Signal yellow. Full-bleed grounds in the brand, which Tenon has no token for. The themes read its ramp for one chart colour only.' },
  steel:        { $type: 'color', $value: at('steel'), $description: 'Raw steel. Hairlines, inactive bars, and captions on Ink.' },
  'steel-dark': { $type: 'color', $value: '#4a4a48', $description: 'Raw steel\'s stand-in on Concrete, for secondary text and borders. Literal: it is not on the steel ramp.' },
  blue:         { $type: 'color', $value: at('blue'), $description: 'IBM blue. Technical diagrams and dense data, never beside orange.' },
  'ink-raised': { $type: 'color', $value: '#1f1f1f', $description: 'Panels on Ink in the dark theme. The brand sheet marks this one derived itself: Ink lifted one step.' },
};

writeFileSync(OUT, JSON.stringify({
  $schema: 'https://www.designtokens.org/schemas/2025.10/format.json',
  $description: 'Tenon colour primitives. Generated, not authored.',
  color: primitives,
}, null, 2) + '\n');

console.table(report);
console.log(`\n${Object.keys(HUES).length} hues x ${STEPS.length} steps -> ${OUT}`);
console.log(`OFFDESK ramps, brand hex pinned at: ${Object.entries(anchorStep).map(([k, v]) => `${k} ${v}`).join(', ')}`);
