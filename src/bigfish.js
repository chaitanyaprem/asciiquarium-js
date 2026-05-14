'use strict';

const DEPTH = require('./depth');
const { randColor } = require('./colors');
const random = require('./random');

function addBigFish(_old, anim) {
  const bigFishRight = `
 ______
\`""-.  \`\`\`\`\`-----.....__
     \`.  .      .       \`-.
       :     .     .       \`.
 ,     :   .    .          _ :
: \`.   :                  (@) \`._
 \`. \`..'     .     =\`-.       .__)
   ;     .        =  ~  :     .-"
 .' .'\`.   .    .  =.-'  \`._ .'
: .'   :               .   .'
 '   .'  .    .     .   .-'
   .'____....----''.'=.'
   ""             .'.'
               ''"\`
`;
  const bigFishLeft = `
                           ______
          __.....-----'''''  .-""'
       .-'       .      .  .'
     .'       .     .     :
    : _          .    .   :     ,
 _.' (@)                  :   .' :
(__.       .-'=     .     \`..' .'
 "-.     :  ~  =        .     ;
   \`. _.'  \`-.=  .    .   .'\`. \`.
     \`.   .               :   \`. :
       \`-.   .     .    .  \`.   \`
          \`.=\`.\`\`----....____\`.
            \`.\`.             ""
              '\`"\`\`
`;
  const maskRight = `
 111111
11111  11111111111111111
     11  2      2       111
       1     2     2       11
 1     1   2    2          1 1
1 11   1                  1W1 111
 11 1111     2     1111       1111
   1     2        1  1  1     111
 11 1111   2    2  1111  111 11
1 11   1               2   11
 1   11  2    2     2   111
   111111111111111111111
   11             1111
               11111
`;
  const maskLeft = `
                           111111
          11111111111111111  11111
       111       2      2  11
     11       2     2     1
    1 1          2    2   1     1
 111 1W1                  1   11 1
1111       1111     2     1111 11
 111     1  1  1        2     1
   11 111  1111  2    2   1111 11
     11   2               1   11 1
       111   2     2    2  11   1
          111111111111111111111
            1111             11
              11111
`;
  const dir = Math.floor(Math.random() * 2);
  let x, speed = 3;
  if (dir) { x = anim.width() - 1; speed *= -1; } else { x = -34; }
  const maxY = 9, minY = anim.height() - 15;
  const y = Math.floor(Math.random() * Math.max(1, minY - maxY)) + maxY;
  const mask = randColor(dir ? maskLeft : maskRight);
  anim.newEntity({
    shape: dir ? bigFishLeft : bigFishRight,
    autoTrans: true,
    color: mask,
    position: [x, y, DEPTH.shark],
    callbackArgs: [speed, 0, 0],
    deathCb: random.randomObject,
    dieOffscreen: true,
    defaultColor: 'Y',
  });
}

module.exports = { addBigFish };
