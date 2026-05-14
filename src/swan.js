'use strict';

const DEPTH = require('./depth');
const random = require('./random');

const SWAN_RIGHT = `
       ___
,_    / _,\\
| \\   \\( \\|
|  \\_  \\\\
(_   \\_) \\
(\\_   \`   \\
 \\   -=~  /
`;

const SWAN_LEFT = `
 ___
/,_ \\    _,
|/ )/   / |
  //  _/  |
 / ( /   _)
/   \`   _/)
\\  ~=-   /
`;

const MASK_RIGHT = `

         g
         yy
`;

const MASK_LEFT = `

 g
yy
`;

function addSwan(_old, anim) {
  const dir = Math.floor(Math.random() * 2);
  const speed = dir ? -1 : 1;
  const x = dir ? anim.width() - 2 : -10;

  anim.newEntity({
    shape: dir ? SWAN_LEFT : SWAN_RIGHT,
    autoTrans: true,
    color: dir ? MASK_LEFT : MASK_RIGHT,
    position: [x, 1, DEPTH.waterGap3],
    callbackArgs: [speed, 0, 0, 0.25],
    deathCb: random.randomObject,
    dieOffscreen: true,
    defaultColor: 'W',
  });
}

module.exports = { addSwan };
