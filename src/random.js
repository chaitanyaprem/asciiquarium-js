'use strict';

// Load each random-object module. Each requires us back (for death
// callbacks), so we attach randomObject to `exports` via mutation —
// that way the partial reference handed out during their load picks
// up the function once we're done.
const { addShark } = require('./shark');
const { addShip } = require('./ship');
const { addWhale } = require('./whale');
const { addMonster } = require('./monster');
const { addBigFish } = require('./bigfish');

const RANDOM_OBJECTS = [addShip, addWhale, addMonster, addBigFish, addShark];

exports.randomObject = function randomObject(dead, anim) {
  const i = Math.floor(Math.random() * RANDOM_OBJECTS.length);
  RANDOM_OBJECTS[i](dead, anim);
};
exports.RANDOM_OBJECTS = RANDOM_OBJECTS;
