'use strict';

const DEPTH = require('./depth');
const random = require('./random');

function addShip(_old, anim) {
  if (anim.getEntitiesOfType('ship').length >= 1) return;
  const shipRight = `
     |    |    |
    )_)  )_)  )_)
   )___))___))___)\\
  )____)____)_____)\\\\
_____|____|____|____\\\\\\__
\\                   /
`;
  const shipLeft = `
         |    |    |
        (_(  (_(  (_(
      /(___((___((___(
    //(_____(____(____(
__///____|____|____|_____
    \\                   /
`;
  const maskRight = `
     y    y    y

                  w
                   ww
yyyyyyyyyyyyyyyyyyyywwwyy
y                   y
`;
  const maskLeft = `
         y    y    y

      w
    ww
yywwwyyyyyyyyyyyyyyyyyyyy
    y                   y
`;
  const dir = Math.floor(Math.random() * 2);
  let x = -24, speed = 1;
  if (dir) { speed *= -1; x = anim.width() - 2; }
  anim.newEntity({
    type: 'ship',
    color: dir ? maskLeft : maskRight,
    shape: dir ? shipLeft : shipRight,
    autoTrans: true,
    position: [x, 0, DEPTH.waterGap1],
    defaultColor: 'w',
    callbackArgs: [speed, 0, 0],
    dieOffscreen: true,
    deathCb: random.randomObject,
  });
}

module.exports = { addShip };
