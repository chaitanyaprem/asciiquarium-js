'use strict';

const DEPTH = require('./depth');
// Late-bind the dispatcher: requires us. We only read random.randomObject
// inside sharkDeath, so a partial exports object during load is fine.
const random = require('./random');

function addShark(_old, anim) {
  const sharkRight = `
                              __
                             ( \`\\
  ,                          )   \`\\
;' \`.                        (     \`\\__
 ;   \`.             __..---''          \`~~~~-._
  \`.   \`.____...--''                       (b  \`--._
    >                     _.-'      .((      ._     )
  .\`.-\`--...__         .-'     -.___.....-(|/|/|/|/'
 ;.'         \`. ...----\`.___.',,,_______......---'
 '           '-'
`;
  const sharkLeft = `
                     __
                    /' )
                  /'   (                          ,
              __/'     )                        .' \`;
      _.-~~~~'          \`\`---..__             .'   ;
 _.--'  b)                       \`\`--...____.'   .'
(     _.      )).      \`-._                     <
 \`\\|\\|\\|\\|)-.....___.-     \`-.         __...--'-.'.
   \`---......_______,,,\`.___.'----... .'         \`.;
                                     \`-\`           \`
`;
  const maskRight = `






                                          cR

                                          cWWWWWWWW


`;
  const maskLeft = `






        Rc

  WWWWWWWWc


`;

  const dir = Math.floor(Math.random() * 2);
  let x = -53;
  const y = Math.floor(Math.random() * Math.max(1, anim.height() - 19)) + 9;
  let teethX = -9;
  const teethY = y + 7;
  let speed = 2;
  if (dir) { speed *= -1; x = anim.width() - 2; teethX = x + 9; }

  anim.newEntity({
    type: 'teeth',
    shape: '*',
    position: [teethX, teethY, DEPTH.shark + 1],
    callbackArgs: [speed, 0, 0],
    physical: true,
  });

  anim.newEntity({
    type: 'shark',
    color: dir ? maskLeft : maskRight,
    shape: dir ? sharkLeft : sharkRight,
    autoTrans: true,
    position: [x, y, DEPTH.shark],
    defaultColor: 'C',
    callbackArgs: [speed, 0, 0],
    dieOffscreen: true,
    deathCb: sharkDeath,
  });
}

function sharkDeath(_shark, anim) {
  for (const t of anim.getEntitiesOfType('teeth')) anim.delEntity(t);
  random.randomObject(null, anim);
}

module.exports = { addShark, sharkDeath };
