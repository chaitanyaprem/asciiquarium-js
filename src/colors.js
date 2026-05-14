'use strict';

// Mask chars: c/C cyan, r/R red, g/G green, y/Y yellow, b/B blue,
//             m/M magenta, w/W white, k/K black. Upper = bright/bold.
const COLOR_CODE = { k: 30, r: 31, g: 32, y: 33, b: 34, m: 35, c: 36, w: 37 };

function ansiColor(code) {
  if (!code || code === ' ') return '\x1b[0m';
  const lower = code.toLowerCase();
  const n = COLOR_CODE[lower];
  if (!n) return '\x1b[0m';
  return code === lower ? `\x1b[22;${n}m` : `\x1b[1;${n}m`;
}

const COLOR_LETTERS = ['c', 'C', 'r', 'R', 'y', 'Y', 'b', 'B', 'g', 'G', 'm', 'M'];

// Replace digit body-part placeholders in a fish mask with random color
// letters. Digit 4 is the eye and is always white.
function randColor(mask) {
  let out = mask.replace(/4/g, 'W');
  for (let i = 1; i <= 9; i++) {
    if (i === 4) continue;
    const c = COLOR_LETTERS[Math.floor(Math.random() * COLOR_LETTERS.length)];
    out = out.replace(new RegExp(String(i), 'g'), c);
  }
  return out;
}

module.exports = { COLOR_CODE, COLOR_LETTERS, ansiColor, randColor };
