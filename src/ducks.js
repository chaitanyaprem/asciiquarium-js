'use strict';

const DEPTH = require('./depth');
const random = require('./random');

// Three ducks in formation. Animation cycles which duck is looking around
// (`<` vs `=`). One mask per direction is shared across the 3 art frames.
const DUCK_RIGHT = [
  `
      _          _          _
,____(')=  ,____(')=  ,____(')<
 \\~~= ')    \\~~= ')    \\~~= ')
`,
  `
      _          _          _
,____(')=  ,____(')<  ,____(')=
 \\~~= ')    \\~~= ')    \\~~= ')
`,
  `
      _          _          _
,____(')<  ,____(')=  ,____(')=
 \\~~= ')    \\~~= ')    \\~~= ')
`,
];

const DUCK_LEFT = [
  `
  _          _          _
>(')____,  =(')____,  =(')____,
 (\` =~~/    (\` =~~/    (\` =~~/
`,
  `
  _          _          _
=(')____,  >(')____,  =(')____,
 (\` =~~/    (\` =~~/    (\` =~~/
`,
  `
  _          _          _
=(')____,  =(')____,  >(')____,
 (\` =~~/    (\` =~~/    (\` =~~/
`,
];

const MASK_RIGHT = `
      g          g          g
wwwwwgcgy  wwwwwgcgy  wwwwwgcgy
 wwww Ww    wwww Ww    wwww Ww
`;

const MASK_LEFT = `
  g          g          g
ygcgwwwww  ygcgwwwww  ygcgwwwww
 wW wwww    wW wwww    wW wwww
`;

function addDucks(_old, anim) {
  if (anim.getEntitiesOfType('duck').length >= 2) return;
  const dir = Math.floor(Math.random() * 2);
  const speed = dir ? -1 : 1;
  const x = dir ? anim.width() - 2 : -30;

  anim.newEntity({
    type: 'duck',
    shape: dir ? DUCK_LEFT : DUCK_RIGHT,
    autoTrans: true,
    color: dir ? MASK_LEFT : MASK_RIGHT,
    position: [x, 5, DEPTH.waterGap3],
    callbackArgs: [speed, 0, 0, 0.25],
    deathCb: random.randomObject,
    dieOffscreen: true,
    defaultColor: 'W',
  });
}

module.exports = { addDucks };
