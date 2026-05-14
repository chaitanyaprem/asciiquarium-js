'use strict';

const DEPTH = require('./depth');

// Four tiled rows of water at the top of the screen. `physical: true`
// lets bubbles collide with the surface and pop.
function addEnvironment(anim) {
  const seg = [
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    '^^^^ ^^^  ^^^   ^^^    ^^^^      ',
    '^^^^      ^^^^     ^^^    ^^     ',
    '^^      ^^^^      ^^^    ^^^^^^  ',
  ];
  const size = seg[0].length;
  const reps = Math.floor(anim.width() / size) + 1;
  for (let i = 0; i < seg.length; i++) {
    anim.newEntity({
      name: `water_seg_${i}`,
      type: 'waterline',
      shape: seg[i].repeat(reps),
      position: [0, i + 5, DEPTH[`waterLine${i}`]],
      defaultColor: 'c',
      physical: true,
    });
  }
}

function addCastle(anim) {
  const image = `
               T~~
               |
              /^\\
             /   \\
 _   _   _  /     \\  _   _   _
[ ]_[ ]_[ ]/ _   _ \\[ ]_[ ]_[ ]
|_=__-_ =_|_[ ]_[ ]_|_=-___-__|
 | _- =  | =_ = _    |= _=   |
 |= -[]  |- = _ =    |_-=_[] |
 | =_    |= - ___    | =_ =  |
 |=  []- |-  /| |\\   |=_ =[] |
 |- =_   | =| | | |  |- = -  |
 |_______|__|_|_|_|__|_______|
`;
  const mask = `
                RR

              yyy
             y   y
            y     y
           y       y



              yyy
             yy yy
            y y y y
            yyyyyyy
`;
  anim.newEntity({
    name: 'castle',
    shape: image,
    color: mask,
    position: [anim.width() - 32, anim.height() - 13, DEPTH.castle],
    defaultColor: 'k',
  });
}

module.exports = { addEnvironment, addCastle };
