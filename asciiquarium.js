#!/usr/bin/env node
// Asciiquarium - Node.js port of the Perl original by Kirk Baucom.
// Original: http://robobunny.com/projects/asciiquarium
// Usage: ./asciiquarium.js [-c]   (-c = classic mode, original 1.0 species only)

'use strict';

const { Animation } = require('./src/engine');
const { addEnvironment, addCastle } = require('./src/environment');
const { addAllSeaweed } = require('./src/seaweed');
const { addAllFish, addFish } = require('./src/fish');
const { addFishhook } = require('./src/fishhook');
const { summonShark } = require('./src/shark');
const { addWhale } = require('./src/whale');
const { addDucks } = require('./src/ducks');
const { addSwan } = require('./src/swan');
const { addDolphins } = require('./src/dolphins');
const { addShip } = require('./src/ship');
const { addBigFish } = require('./src/bigfish');
const { addMonster } = require('./src/monster');
const { addBigBubble } = require('./src/bubble');
const { randomObject } = require('./src/random');

function parseArgs(argv) {
  const opts = { classic: false, kids: false };
  for (const a of argv.slice(2)) {
    if (a === '-c') opts.classic = true;
    else if (a === '-k' || a === '--kids') opts.kids = true;
    else if (a === '-h' || a === '--help') {
      process.stdout.write(
        'Usage: asciiquarium.js [-c] [-k|--kids]\n' +
        '  -c          classic mode (1.0 species only)\n' +
        '  -k --kids   toddler mode: every unmapped key spawns something random\n' +
        '\nQuit with Ctrl+C (q is intentionally not a quit key).\n'
      );
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

// Pop a bubble out of up to 6 currently-alive fish simultaneously. Picking
// different fish (rather than 6 from one) keeps the bubbles visually
// separate without needing custom jitter.
function bubbleBurst(anim) {
  const fishes = anim.getEntitiesOfType('fish');
  if (fishes.length === 0) return;
  const shuffled = fishes.slice().sort(() => Math.random() - 0.5);
  const n = Math.min(6, shuffled.length);
  for (let i = 0; i < n; i++) addBigBubble(shuffled[i], anim);
}

function main() {
  const opts = parseArgs(process.argv); // -c accepted but only classic art is bundled

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

  // Lowercase the keystroke once so each binding handles both cases.
  // Ctrl+C (\x03) is always the escape hatch, including in kids mode.
  process.stdin.on('data', (key) => {
    const raw = key.toString();
    if (raw === '\x03') quit();
    const k = raw.toLowerCase();

    // Bindings shared by both modes.
    switch (k) {
      case 'r': rebuild = true; return;
      case 'p': paused = !paused; return;
      case 'j': addFishhook(null, anim); return;
      case 's': summonShark(anim); return;
      case 'd': addDucks(null, anim); return;
      case 'w': addWhale(null, anim); return;
      case 'n': addSwan(null, anim); return;
      case 'k': addDolphins(null, anim); return;
      case 'h': addShip(null, anim); return;
      case 'g': addBigFish(null, anim); return;
      case 'm': addMonster(null, anim); return;
      case 'f': addFish(null, anim); return;
      case 'b': bubbleBurst(anim); return;
    }

    // 'q' is intentionally not a quit key — toddlers find it. Ctrl+C
    // (\x03 / SIGINT) is the exit path. In kids mode, every other
    // unmapped key triggers a random spawn so smashing is always rewarded.
    if (k === 'q') return;
    if (opts.kids) randomObject(null, anim);
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
