'use strict';

const DEPTH = require('./depth');

function addAllSeaweed(anim) {
  const count = Math.floor(anim.width() / 15);
  for (let i = 0; i < count; i++) addSeaweed(null, anim);
}

// Two-frame swaying seaweed. Each stalk lives 8–12 minutes and
// respawns via deathCb.
function addSeaweed(_old, anim) {
  const height = Math.floor(Math.random() * 4) + 3;
  const frames = ['', ''];
  for (let i = 1; i <= height; i++) {
    const left = i % 2;
    const right = 1 - left;
    frames[left]  += '(\n';
    frames[right] += ' )\n';
  }
  const x = Math.floor(Math.random() * (anim.width() - 2)) + 1;
  const y = anim.height() - height;
  const speed = Math.random() * 0.05 + 0.25;
  anim.newEntity({
    name: 'seaweed' + Math.random(),
    shape: frames,
    position: [x, y, DEPTH.seaweed],
    callbackArgs: [0, 0, 0, speed],
    dieTime: Date.now() + (Math.floor(Math.random() * 4 * 60) + 8 * 60) * 1000,
    deathCb: addSeaweed,
    defaultColor: 'g',
  });
}

module.exports = { addAllSeaweed, addSeaweed };
