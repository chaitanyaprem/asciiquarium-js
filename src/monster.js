'use strict';

const DEPTH = require('./depth');
const random = require('./random');

// Old-style 4-frame Loch-Ness style monster.
function addMonster(_old, anim) {
  const monsterRight = [
`
                                                          ____
            __                                          /   o  \\
          /    \\        _                         _       /     ____ >
  _      |  __  |     /   \\        _            /   \\    |     |
 | \\     |  ||  |    |     |     /   \\         |     |   |     |
`,
`
                                                          ____
                                             __         /   o  \\
             _                         _       /    \\     /     ____ >
   _       /   \\        _            /   \\    |  __  |   |     |
  | \\     |     |     /   \\         |     |   |  ||  |   |     |
`,
`
                                                          ____
                                  __                    /   o  \\
 _                      _       /    \\        _       /     ____ >
| \\          _        /   \\    |  __  |     /   \\    |     |
 \\ \\       /   \\     |     |   |  ||  |    |     |   |     |
`,
`
                                                          ____
                       __                               /   o  \\
  _          _       /    \\        _                  /     ____ >
 | \\       /   \\    |  __  |     /   \\        _      |     |
  \\ \\     |     |   |  ||  |    |     |     /   \\    |     |
`,
  ];
  const monsterLeft = [
`
    ____
  /  o   \\                                          __
< ____     \\       _                         _    /    \\
      |     |    /   \\        _            /   \\  |  __  |      _
      |     |   |     |     /   \\         |     | |  ||  |     / |
`,
`
    ____
  /  o   \\         __
< ____     \\     /    \\       _                         _
      |     |   |  __  |    /   \\        _            /   \\       _
      |     |   |  ||  |   |     |     /   \\         |     |     / |
`,
`
    ____
  /  o   \\                    __
< ____     \\       _        /    \\       _                          _
      |     |    /   \\     |  __  |    /   \\        _              / |
      |     |   |     |    |  ||  |   |     |     /   \\           / /
`,
`
    ____
  /  o   \\                                __
< ____     \\                      _     /    \\       _            _
      |     |          _        /   \\  |  __  |    /   \\         / |
      |     |        /   \\     |     |  |  ||  |  |     |       / /
`,
  ];
  const maskRight = `


                                                            W



`;
  const maskLeft = `


     W



`;

  const dir = Math.floor(Math.random() * 2);
  const speed = dir ? -2 : 2;
  const x = dir ? anim.width() - 2 : -64;
  const mask = dir ? maskLeft : maskRight;
  anim.newEntity({
    shape: dir ? monsterLeft : monsterRight,
    autoTrans: true,
    color: [mask, mask, mask, mask],
    position: [x, 2, DEPTH.waterGap2],
    callbackArgs: [speed, 0, 0, 0.25],
    deathCb: random.randomObject,
    dieOffscreen: true,
    defaultColor: 'G',
  });
}

module.exports = { addMonster };
