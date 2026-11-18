import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles.css', 'utf8');
const colors = Object.fromEntries([...css.matchAll(/--([a-z-]+):\s*(#[\da-fA-F]{6})\s*[;}]/g)].map(([, name, value]) => [name, value]));

function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(channel => parseInt(channel, 16) / 255);
  const linear = rgb.map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
}

function contrast(foreground, background) {
  const [dark, light] = [luminance(foreground), luminance(background)].sort((a, b) => a - b);
  return (light + .05) / (dark + .05);
}

describe('WCAG color contrast for the site palette', () => {
  const textPairs = [
    ['ink', 'paper'], ['muted', 'paper'], ['accent', 'paper'],
    ['muted', 'panel'], ['accent', 'panel'], ['accent', 'accent-soft'],
    ['accent', 'contact-hover'], ['muted', 'contact-hover'],
    ['muted', 'accent-soft'], ['cyan', 'paper'], ['coral', 'paper'],
    ['#ffffff', 'accent'], ['#ffffff', 'accent-hover'],
  ];
  it.each(textPairs)('%s on %s meets 4.5:1 for normal text', (foreground, background) => {
    const ratio = contrast(colors[foreground] || foreground, colors[background] || background);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
  it.each(['paper', 'accent-soft', 'panel'])('control outlines on %s meet 3:1', background => {
    expect(contrast(colors['control-border'], colors[background])).toBeGreaterThanOrEqual(3);
    expect(contrast(colors.focus, colors[background])).toBeGreaterThanOrEqual(3);
  });
});
