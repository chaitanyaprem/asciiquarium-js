'use strict';

const DEPTH = require('./depth');
const random = require('./random');

// 12-frame animation: 5 spoutless followed by 7 spout frames.
function addWhale(_old, anim) {
  if (anim.getEntitiesOfType('whale').length >= 1) return;
  const whaleRight = `
        .-----:
      .'       \`.
,    /       (o) \\
\\\`._/          ,__)
`;
  const whaleLeft = `
    :-----.
  .'       \`.
 / (o)       \\    ,
(__,          \\_.'/
`;
  const maskRight = `
             C C
           CCCCCCC
           C  C  C
        BBBBBBB
      BB       BB
B    B       BWB B
BBBBB          BBBB
`;
  const maskLeft = `
   C C
 CCCCCCC
 C  C  C
    BBBBBBB
  BB       BB
 B BWB       B    B
BBBB          BBBBB
`;
  const spoutFrames = [
    `\n\n   :\n`,
    `\n   :\n   :\n`,
    `  . .\n  -:-\n   :\n`,
    `  . .\n .-:-.\n   :\n`,
    `  . .\n'.-:-.\`\n'  :  '\n`,
    `\n .- -.\n;  :  ;\n`,
    `\n\n;     ;\n`,
  ];

  const dir = Math.floor(Math.random() * 2);
  const speed = dir ? -1 : 1;
  const spoutAlign = dir ? 1 : 11;
  const x = dir ? anim.width() - 2 : -18;

  const whaleArt = dir ? whaleLeft : whaleRight;
  const mask = dir ? maskLeft : maskRight;

  const frames = [];
  const masks = [];
  for (let i = 0; i < 5; i++) {
    frames.push('\n\n\n' + whaleArt);
    masks.push(mask);
  }
  const pad = ' '.repeat(spoutAlign);
  for (const sf of spoutFrames) {
    const aligned = sf.split('\n').join('\n' + pad);
    frames.push(aligned + whaleArt);
    masks.push(mask);
  }

  anim.newEntity({
    type: 'whale',
    color: masks,
    shape: frames,
    autoTrans: true,
    position: [x, 0, DEPTH.waterGap2],
    defaultColor: 'w',
    callbackArgs: [speed, 0, 0, 1],
    dieOffscreen: true,
    deathCb: random.randomObject,
  });
}

module.exports = { addWhale };
