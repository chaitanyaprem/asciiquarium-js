'use strict';

// Each entity module circularly requires us for its deathCb, so we can't
// destructure them at the top — whichever module starts the load cycle
// would hand us a partial exports object. We resolve at call time
// instead. `require` is cached, so this is essentially free after the
// first invocation.
exports.randomObject = function randomObject(dead, anim) {
  const adders = [
    require('./ship').addShip,
    require('./whale').addWhale,
    require('./monster').addMonster,
    require('./bigfish').addBigFish,
    require('./shark').addShark,
    require('./fishhook').addFishhook,
    require('./swan').addSwan,
    require('./ducks').addDucks,
    require('./dolphins').addDolphins,
  ];
  const i = Math.floor(Math.random() * adders.length);
  adders[i](dead, anim);
};
