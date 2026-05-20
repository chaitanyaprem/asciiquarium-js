'use strict';

// Bubble that drifts up from a fish. The 5 frames grow as it rises;
// it pops on contact with the waterline.
function addBubble(fish, anim) {
  const [fw, fh] = fish.size();
  let [bx, by, bz] = fish.position();
  if (fish.dx > 0) bx += fw;
  by += Math.floor(fh / 2);
  bz -= 1;
  anim.newEntity({
    type: 'bubble',
    shape: ['.', 'o', 'O', 'O', 'O'],
    position: [bx, by, bz],
    callbackArgs: [0, -1, 0, 0.1],
    dieOffscreen: true,
    physical: true,
    collHandler: bubbleCollision,
    defaultColor: 'C',
  });
}

// Same lifecycle as addBubble but with larger multi-line frames so it
// reads as a "big" bubble. Only used by the `b` key burst — random
// fish bubbles still use addBubble's small frames.
function addBigBubble(fish, anim) {
  const [fw, fh] = fish.size();
  let [bx, by, bz] = fish.position();
  if (fish.dx > 0) bx += fw;
  by += Math.floor(fh / 2);
  bz -= 1;
  anim.newEntity({
    type: 'bubble',
    shape: [
      '.',
      'o',
      'O',
      ' ___ \n(   )\n \\_/ ',
      '  ___  \n /   \\ \n(     )\n \\___/ ',
    ],
    autoTrans: true,
    position: [bx, by, bz],
    callbackArgs: [0, -1, 0, 0.1],
    dieOffscreen: true,
    physical: true,
    collHandler: bubbleCollision,
    defaultColor: 'C',
  });
}

function bubbleCollision(bubble, _anim) {
  for (const o of bubble.collisions()) {
    if (o.type === 'waterline') { bubble.kill(); break; }
  }
}

module.exports = { addBubble, addBigBubble, bubbleCollision };
