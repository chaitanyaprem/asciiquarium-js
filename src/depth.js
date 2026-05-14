'use strict';

// Z-depth: lower = closer to viewer (drawn last / on top).
const DEPTH = {
  guiText: 0,
  gui: 1,

  shark: 2,
  fishStart: 3,
  fishEnd: 20,
  seaweed: 21,
  castle: 22,

  waterLine3: 2,
  waterGap3: 3,
  waterLine2: 4,
  waterGap2: 5,
  waterLine1: 6,
  waterGap1: 7,
  waterLine0: 8,
  waterGap0: 9,
};

module.exports = DEPTH;
