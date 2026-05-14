'use strict';

const DEPTH = require('./depth');
const random = require('./random');

const SHARK_RIGHT = `
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
const SHARK_LEFT = `
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
const MASK_RIGHT = `






                                          cR

                                          cWWWWWWWW


`;
const MASK_LEFT = `






        Rc

  WWWWWWWWc


`;

// Build a shark + its associated invisible `teeth` collider. Each shark
// keeps a reference to its own teeth on `shark._teeth` so the death
// callback only sweeps its own — important once multiple sharks can
// coexist (e.g. summoned via the 's' key).
function createShark(anim, deathCb) {
  const dir = Math.floor(Math.random() * 2);
  let x = -53;
  const y = Math.floor(Math.random() * Math.max(1, anim.height() - 19)) + 9;
  let teethX = -9;
  const teethY = y + 7;
  let speed = 2;
  if (dir) { speed *= -1; x = anim.width() - 2; teethX = x + 9; }

  const teeth = anim.newEntity({
    type: 'teeth',
    shape: '*',
    position: [teethX, teethY, DEPTH.shark + 1],
    callbackArgs: [speed, 0, 0],
    physical: true,
  });

  const shark = anim.newEntity({
    type: 'shark',
    color: dir ? MASK_LEFT : MASK_RIGHT,
    shape: dir ? SHARK_LEFT : SHARK_RIGHT,
    autoTrans: true,
    position: [x, y, DEPTH.shark],
    defaultColor: 'C',
    callbackArgs: [speed, 0, 0],
    dieOffscreen: true,
    deathCb,
  });
  shark._teeth = teeth;
  return shark;
}

// Random-rotation spawn: when this shark dies, fire off the next random
// event.
function addShark(_old, anim) {
  createShark(anim, sharkDeath);
}

// Manual summon (e.g. 's' key): no follow-up random spawn.
function summonShark(anim) {
  createShark(anim, sharkCleanup);
}

function sharkCleanup(shark, anim) {
  if (shark._teeth) anim.delEntity(shark._teeth);
}

function sharkDeath(shark, anim) {
  sharkCleanup(shark, anim);
  random.randomObject(null, anim);
}

module.exports = { addShark, summonShark, sharkDeath };
