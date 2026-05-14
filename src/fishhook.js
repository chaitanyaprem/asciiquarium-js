'use strict';

const DEPTH = require('./depth');
const random = require('./random');

const HOOK_IMAGE = `
       o
      ||
      ||
/ \\   ||
  \\__//
  \`--'
`;

const POINT_IMAGE = `
.

\\

`;

const LINE_IMAGE = '|\n'.repeat(50) + ' \n'.repeat(6);

// Three-entity hook (line, hook, hook_point). Descend until ~3/4 of the
// screen height, then park. On catch, retract() is called on all four
// (fish, point, hook, line) and they reel back to the surface.
function addFishhook(_old, anim) {
  if (anim.getEntitiesOfType('fishhook').length > 0) return;

  const x = 10 + Math.floor(Math.random() * Math.max(1, anim.width() - 20));
  const y = -4;
  const pointX = x + 1;
  const pointY = y + 2;

  anim.newEntity({
    type: 'fishline',
    shape: LINE_IMAGE,
    position: [x + 7, y - 50, DEPTH.waterLine1],
    autoTrans: true,
    callback: fishhookCallback,
    defaultColor: 'w',
  });

  anim.newEntity({
    type: 'fishhook',
    shape: HOOK_IMAGE,
    position: [x, y, DEPTH.waterLine1],
    autoTrans: true,
    dieOffscreen: true,
    deathCb: fishhookGroupDeath,
    defaultColor: 'G',
    callback: fishhookCallback,
  });

  anim.newEntity({
    type: 'hook_point',
    shape: POINT_IMAGE,
    position: [pointX, pointY, DEPTH.shark + 1],
    physical: true,
    defaultColor: 'G',
    callback: fishhookCallback,
  });
}

function fishhookCallback(entity, anim) {
  if (entity._hooked) {
    entity.physY -= 1;
    entity.y = Math.floor(entity.physY);
  } else if (entity.y + entity.height() < anim.height() * 0.75) {
    entity.physY += 1;
    entity.y = Math.floor(entity.physY);
  }
}

function fishhookGroupDeath(_dead, anim) {
  for (const t of anim.getEntitiesOfType('hook_point')) anim.delEntity(t);
  for (const l of anim.getEntitiesOfType('fishline')) anim.delEntity(l);
  random.randomObject(null, anim);
}

// Called from fish.js collision handler. Marks the entity for reel-in.
// Fish also gets pulled up the z-stack so it visibly rides over the waves.
function retract(entity) {
  entity.physical = false;
  if (entity.type === 'fish') {
    entity.z = DEPTH.waterGap2;
    entity.physZ = entity.z;
    entity.callback = fishhookCallback;
  }
  entity._hooked = true;
}

module.exports = { addFishhook, retract };
