'use strict';

const DEPTH = require('./depth');
const random = require('./random');

// Crab: scuttles along the seabed sideways. Two-frame leg animation gives a
// satisfying little shuffle — toddlers love watching things wiggle.
const CRAB_RIGHT = `
   /\\  /\\
   \\/  \\/
 _ o~~~o _
/ \\____/ \\
`;

const CRAB_LEFT = `
   /\\  /\\
   \\/  \\/
 _ o~~~o _
/ \\____/ \\
`;

// Mask: r=body/claws, Y=eyes. The ~ lines are the body edge (falls to default).
const MASK_RIGHT = `


  yy  yy
  yy  yy
 rr======rr
r rrrrrrrr r
`;

const MASK_LEFT = `


  yy  yy
  yy  yy
 rr======rr
r rrrrrrrr r
`;

const MAX_CRABS = 3;
let lastDir = 1;

function addCrab(_old, anim) {
  if (anim.getEntitiesOfType('crab').length >= MAX_CRABS) return;
  // Alternate sides so repeated summons feel intentional.
  const dir = lastDir ? 0 : 1;
  lastDir = dir;
  const shape = dir ? CRAB_LEFT : CRAB_RIGHT;
  const color = dir ? MASK_LEFT : MASK_RIGHT;
  let x, speed = 0.6;
  // Important: entities with dieOffscreen=true are killed if they start fully
  // outside the viewport, so the left spawn must begin with at least 1 column
  // visible.
  if (dir) { x = anim.width() - 2; speed *= -1; } else { x = -2; }
  // Keep crab near the bottom — it's a seabed creature.
  const y = anim.height() - 7;

  anim.newEntity({
    type: 'crab',
    shape,
    autoTrans: true,
    color,
    position: [x, y, DEPTH.seaweed],
    callbackArgs: [speed, 0, 0, 2], // every 2nd frame switches leg position
    deathCb: random.randomObject,
    dieOffscreen: true,
    defaultColor: 'r',
  });
}

module.exports = { addCrab };
