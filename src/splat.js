'use strict';

// Death animation when a shark catches a small fish. Lives 15 frames
// then disappears (dieFrame).
function addSplat(anim, x, y, z) {
  const frames = [
`

   .
  ***
   '

`,
`

 ",*;\`
 "*,**
 *"'~'

`,
`
  , ,
 " ","'
 *" *'"
  " ; .

`,
`* ' , ' \`
' \` * . '
 ' \`' ",'
* ' " * .
" * ', '
`,
  ];
  anim.newEntity({
    shape: frames,
    position: [x - 4, y - 2, z - 2],
    defaultColor: 'R',
    callbackArgs: [0, 0, 0, 0.25],
    transparent: ' ',
    dieFrame: 15,
  });
}

module.exports = { addSplat };
