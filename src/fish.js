'use strict';

const DEPTH = require('./depth');
const { randColor } = require('./colors');
const { Entity } = require('./engine');
const { addBubble } = require('./bubble');
const { addSplat } = require('./splat');

// Body-part legend in art/mask:
//   1 body  2 dorsal fin  3 flippers  4 eye  5 mouth  6 tailfin  7 gills
// Pairs alternate right-facing (even index) and left-facing (odd index).
const OLD_FISH = [
  // medium ( \_/ ) facing right
  `
   \\
  / \\
>=_('>
  \\_/
   /
`,
  `
   2
  1 1
661745
  111
   3
`,
  // facing left
  `
  /
 / \\
<')_=<
 \\_/
  \\
`,
  `
  2
 1 1
547166
 111
  3
`,
  // tilted right
  `
  ,\\
>=('>
  '/
`,
  `
  12
66745
  13
`,
  // tilted left
  `
 /,
<')=<
 \\\`
`,
  `
 21
54766
 31
`,
  // tiny right
  `
  __
><_'>
   '
`,
  `
  11
61145
   3
`,
  // tiny left
  `
 __
<'_><
 \`
`,
  `
 11
54116
 3
`,
  // small right
  `
   ..\\,
>='   ('>
  '''/''
`,
  `
   1121
661   745
  111311
`,
  // small left
  `
  ,/..
<')   \`=<
 \`\`\\\`\`\`
`,
  `
  1211
547   166
 113111
`,
  // chub right
  `
  __
\\/ o\\
/\\__/
`,
  `
  11
61 41
61111
`,
  // chub left
  `
 __
/o \\/
\\__/\\
`,
  `
 11
14 16
11116
`,
];

function addAllFish(anim) {
  const screenSize = (anim.height() - 9) * anim.width();
  const count = Math.floor(screenSize / 350);
  for (let i = 0; i < count; i++) addFish(null, anim);
}

function addFish(_old, anim) { addFishEntity(anim, OLD_FISH); }

function addFishEntity(anim, fishImages) {
  const numFish = Math.floor(Math.random() * (fishImages.length / 2));
  const idx = numFish * 2;
  let speed = Math.random() * 2 + 0.25;
  const depth = Math.floor(Math.random() * (DEPTH.fishEnd - DEPTH.fishStart)) + DEPTH.fishStart;
  const mask = randColor(fishImages[idx + 1]);

  const leftFacing = (numFish % 2) === 1;
  if (leftFacing) speed *= -1;

  // Probe entity to get pixel size before positioning.
  const tmp = new Entity({ shape: fishImages[idx], autoTrans: true, position: [0, 0, 0] });
  const fw = tmp.width(), fh = tmp.height();
  const maxY = 9, minY = anim.height() - fh;
  const y = Math.max(maxY, Math.floor(Math.random() * Math.max(1, minY - maxY)) + maxY);
  const x = leftFacing ? anim.width() - 2 : 1 - fw;

  anim.newEntity({
    type: 'fish',
    shape: fishImages[idx],
    autoTrans: true,
    color: mask,
    position: [x, y, depth],
    callback: fishCallback,
    callbackArgs: [speed, 0, 0],
    dieOffscreen: true,
    deathCb: addFish,
    physical: true,
    collHandler: fishCollision,
  });
}

function fishCallback(fish, anim) {
  if (Math.random() * 100 > 97) addBubble(fish, anim);
  anim.moveEntity(fish);
}

function fishCollision(fish, anim) {
  for (const o of fish.collisions()) {
    if (o.type === 'teeth' && fish.height() <= 5) {
      const [px, py, pz] = o.position();
      addSplat(anim, px, py, pz);
      fish.kill();
      break;
    }
  }
}

module.exports = { addAllFish, addFish, OLD_FISH };
