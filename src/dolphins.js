'use strict';

const DEPTH = require('./depth');
const random = require('./random');

// Trio of dolphins jumping in formation. Each follows the same cyclic
// path of dy/frameSpeed tuples (up arc → glide → down arc → glide),
// but enters at a different phase so they look like a wave.
const DOLPHIN_RIGHT = [
  `
        ,
      __)\\_
(\\_.-'    a\`-.
(/~~\`\`\`\`(/~^^\`
`,
  `
        ,
(\\__  __)\\_
(/~.''    a\`-.
    \`\`\`\`\\)~^^\`
`,
];

const DOLPHIN_LEFT = [
  `
     ,
   _/(__
.-'a    \`-._/)
'^^~\\)''''~~\\)
`,
  `
     ,
   _/(__  __/)
.-'a    \`\`.~\\)
'^^~(/''''
`,
];

const MASK_RIGHT = `


          W
`;

const MASK_LEFT = `


   W
`;

function addDolphins(_old, anim) {
  if (anim.getEntitiesOfType('dolphin').length >= 2) return;
  const dir = Math.floor(Math.random() * 2);
  let speed = 1;
  let distance = 15;
  let x;
  if (dir) { speed = -1; distance = -15; x = anim.width() - 2; }
  else { x = -13; }

  const up    = [speed, -0.5, 0, 0.5];
  const down  = [speed,  0.5, 0, 0.5];
  const glide = [speed,  0,   0, 0.5];

  const path = [];
  for (let i = 0; i < 14; i++) path.push(up);
  for (let i = 0; i < 2;  i++) path.push(glide);
  for (let i = 0; i < 14; i++) path.push(down);
  for (let i = 0; i < 6;  i++) path.push(glide);

  const shape = dir ? DOLPHIN_LEFT : DOLPHIN_RIGHT;
  const color = dir ? MASK_LEFT : MASK_RIGHT;

  const d3 = anim.newEntity({
    shape, autoTrans: true, color,
    position: [x - distance * 2, 8, DEPTH.waterGap3],
    callback: dolphinCallback,
    deathCb: random.randomObject,
    dieOffscreen: false,
    defaultColor: 'b',
  });
  d3._path = path; d3._phase = 0; d3._tick = 0;

  const d2 = anim.newEntity({
    shape, autoTrans: true, color,
    position: [x - distance, 2, DEPTH.waterGap3],
    callback: dolphinCallback,
    dieOffscreen: false,
    defaultColor: 'B',
  });
  d2._path = path; d2._phase = 12; d2._tick = 0;

  const d1 = anim.newEntity({
    type: 'dolphin',
    shape, autoTrans: true, color,
    position: [x, 5, DEPTH.waterGap3],
    callback: dolphinCallback,
    deathCb: () => { d2.dieOffscreen = true; d3.dieOffscreen = true; },
    dieOffscreen: true,
    defaultColor: 'C',
  });
  d1._path = path; d1._phase = 24; d1._tick = 0;
}

function dolphinCallback(d, _anim) {
  const idx = (d._tick + d._phase) % d._path.length;
  const [dx, dy, dz, fs] = d._path[idx];
  d.physX += dx;
  d.physY += dy;
  d.physZ += dz;
  d.physFrame += fs;
  d.x = Math.floor(d.physX);
  d.y = Math.floor(d.physY);
  d.z = Math.floor(d.physZ);
  d._tick += 1;
}

module.exports = { addDolphins };
