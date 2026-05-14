#!/usr/bin/env node
// Asciiquarium - Node.js port of the Perl original by Kirk Baucom.
// Original: http://robobunny.com/projects/asciiquarium
// Usage: ./asciiquarium.js [-c]   (-c = classic mode, original 1.0 species only)

'use strict';

const { Animation } = require('./src/engine');
const { addEnvironment, addCastle } = require('./src/environment');
const { addAllSeaweed } = require('./src/seaweed');
const { addAllFish } = require('./src/fish');
const { addFishhook } = require('./src/fishhook');
const { summonShark } = require('./src/shark');
const { randomObject } = require('./src/random');

function parseArgs(argv) {
  const opts = { classic: false };
  for (const a of argv.slice(2)) {
    if (a === '-c') opts.classic = true;
    else if (a === '-h' || a === '--help') {
      process.stdout.write('Usage: asciiquarium.js [-c]\n  -c  classic mode (1.0 species only)\n');
      process.exit(0);
    } else if (a === '-v' || a === '--version') {
      process.stdout.write('asciiquarium.js 1.1 (node port)\n');
      process.exit(0);
    }
  }
  return opts;
}

function setupTerminal() {
  process.stdout.write('\x1b[?1049h'); // alternate screen buffer
  process.stdout.write('\x1b[?25l');   // hide cursor
  process.stdout.write('\x1b[2J');     // clear
  if (process.stdin.isTTY) process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
}

function restoreTerminal() {
  process.stdout.write('\x1b[0m');
  process.stdout.write('\x1b[?25h');   // show cursor
  process.stdout.write('\x1b[?1049l'); // leave alt screen
  if (process.stdin.isTTY) {
    try { process.stdin.setRawMode(false); } catch {}
  }
}

function quit(msg) {
  restoreTerminal();
  if (msg) process.stderr.write(msg + '\n');
  process.exit(0);
}

function main() {
  parseArgs(process.argv); // -c accepted but only classic art is bundled

  setupTerminal();
  process.on('exit', restoreTerminal);
  process.on('SIGINT', () => quit());
  process.on('SIGTERM', () => quit());
  process.on('uncaughtException', (e) => { restoreTerminal(); console.error(e); process.exit(1); });

  let paused = false;
  let rebuild = true;
  const anim = new Animation();

  function build() {
    anim.updateTermSize();
    anim.removeAllEntities();
    addEnvironment(anim);
    addCastle(anim);
    addAllSeaweed(anim);
    addAllFish(anim);
    randomObject(null, anim);
    anim.redrawScreen();
  }

  process.stdin.on('data', (key) => {
    const k = key.toString();
    if (k === '\x03' || k === 'q' || k === 'Q') quit();
    else if (k === 'r' || k === 'R') rebuild = true;
    else if (k === 'p' || k === 'P') paused = !paused;
    else if (k === 'j' || k === 'J') addFishhook(null, anim);
    else if (k === 's' || k === 'S') summonShark(anim);
  });

  process.stdout.on('resize', () => { rebuild = true; });

  const tick = () => {
    if (rebuild) { build(); rebuild = false; return; }
    if (!paused) anim.animate();
  };

  build();
  setInterval(tick, 100);
}

main();
