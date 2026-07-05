# Plan: Baby shark summoned with the `y` key

Goal: pressing `y` (case-insensitive) spawns a **baby shark** — a smaller, harmless
version of the existing big shark. Modeled directly on `src/shark.js`.

Files touched:

| File | Change |
|---|---|
| `src/shark.js` | add baby-shark art + masks, `createBabyShark()`, `summonBabyShark()`, export it |
| `asciiquarium.js` | import `summonBabyShark`, add `case 'y':` to the key switch |
| `CLAUDE.md` | add `y` to the Summon controls list |

---

## Design decisions (read before coding)

1. **No teeth collider.** The big shark spawns an invisible physical `teeth`
   entity that kills small fish (`fish.js` collision → splat). The baby shark is
   deliberately harmless: it is just a moving entity — no `physical`, no teeth,
   no `_teeth` cleanup needed. This also keeps kids mode friendly.
2. **Death chains a random event.** Per the repo convention (see "Controls" in
   CLAUDE.md): most manual summoners use `random.randomObject` as `deathCb` so
   each summon chains one extra random event. The `s` (big shark) exception
   exists only because it must clean up its teeth entity. The baby shark has
   nothing to clean up, so follow the majority convention.
3. **Same depth and color scheme as the parent:** z = `DEPTH.shark`, default
   color `'C'` (cyan), white `*` eye via the color mask.
4. **Slightly faster than the parent** (`speed = 2.5` vs `2`) — fractional
   `callbackArgs` are supported (accumulated by the engine).

---

## Step 0 — GitNexus obligations (required by CLAUDE.md)

If you have access to the GitNexus MCP tools:

- Before editing, run `gitnexus_impact({target: "summonShark", direction: "upstream"})`
  and `gitnexus_impact({target: "main", direction: "upstream"})` and report the
  blast radius. (Expected: LOW risk — `summonShark` is only called from the key
  handler in `asciiquarium.js`; you are adding a sibling, not changing it.)
- Before committing, run `gitnexus_detect_changes()` and confirm only
  `src/shark.js`, `asciiquarium.js`, and docs are affected.
- If any tool warns the index is stale, run `npx gitnexus analyze` first.

If you do not have MCP access, note in your summary that these steps were skipped.

## Step 1 — Art and masks in `src/shark.js`

Add below the existing `MASK_LEFT` constant. The art is the classic 4-row ASCII
shark (~21 columns): `/"*._` dorsal fin, `*` eye, `))` gills, open mouth facing
the direction of travel, tail fin at the rear.

The blocks below are **already escaped** for this repo's template-literal
convention (`\` written as `\\`, `` ` `` written as `` \` ``) — copy them
verbatim, do not re-escape. Keep the shape flush against the backticks the same
way `SHARK_RIGHT` does (the leading/trailing newline is stripped by
`parseFrame()`).

```js
const BABY_SHARK_LEFT = `
      /"*._         _
  .-*'\`    \`*-.._.-'/
< * ))     ,       (
  \`*-._\`._(__.--*"\`.\\
`;
const BABY_SHARK_RIGHT = `
_         _.*"\\
\\\`-._..-*'    '\`*-.
 )       ,     (( * >
/.'"*--.__)_.'_.-*'
`;
```

Rendered (what you should see if you `console.log` them — verify this before
moving on):

```
      /"*._         _          |  _         _.*"\
  .-*'`    `*-.._.-'/          |  \`-._..-*'    '`*-.
< * ))     ,       (           |   )       ,     (( * >
  `*-._`._(__.--*"`.\          |  /.'"*--.__)_.'_.-*'
        (swims left)           |        (swims right)
```

Color masks (same line shape as the art; space = fall back to `defaultColor`).
Only the `*` eye gets an override: `W` (white), matching how fish eyes are
colored. The eye is on **row 3** of each shape — column 2 in the left art,
column 18 in the right art:

```js
const BABY_MASK_LEFT = `


  W
`;
const BABY_MASK_RIGHT = `


                  W
`;
```

Mask alignment rule: the `W` must sit in the exact column of the `*` eye. Note
each shape also contains a second `*` on other rows (fin/tail curves) — those
must stay body-colored, so the mask rows above/below the eye row stay blank.
If a stray white cell shows up at runtime, the mask column is off by one.

## Step 2 — Spawn functions in `src/shark.js`

Add after `createShark`. Follow `createShark`'s structure but simpler (no teeth
entity):

```js
// Baby shark: smaller, harmless (no teeth collider), summoned with 'y'.
function createBabyShark(anim, deathCb) {
  const dir = Math.floor(Math.random() * 2);
  let x = -22;                                   // art is ~21 cols wide
  // Art is 4 rows tall; keep it fully under the waterline (surface ≈ y 9).
  const y = Math.floor(Math.random() * Math.max(1, anim.height() - 13)) + 9;
  let speed = 2.5;
  if (dir) { speed *= -1; x = anim.width() - 2; }

  anim.newEntity({
    type: 'baby_shark',
    color: dir ? BABY_MASK_LEFT : BABY_MASK_RIGHT,
    shape: dir ? BABY_SHARK_LEFT : BABY_SHARK_RIGHT,
    autoTrans: true,
    position: [x, y, DEPTH.shark],
    defaultColor: 'C',
    callbackArgs: [speed, 0, 0],
    dieOffscreen: true,
    deathCb,
  });
}

// Manual summon ('y' key). Chains one random event on death, matching the
// other summoners (unlike 's', which only needs teeth cleanup).
function summonBabyShark(anim) {
  createBabyShark(anim, babySharkDeath);
}

function babySharkDeath(_baby, anim) {
  random.randomObject(null, anim);
}
```

Notes:
- `random.randomObject` must be read **inside** the function body (as above),
  never captured at module top level — see the circular-dependency section of
  CLAUDE.md.
- Update the export line to
  `module.exports = { addShark, summonShark, sharkDeath, summonBabyShark };`
- Do **not** touch `createShark` / `summonShark` / `sharkDeath`.

## Step 3 — Key binding in `asciiquarium.js`

1. Change the existing import:
   `const { summonShark, summonBabyShark } = require('./src/shark');`
2. In the `switch (k)` block inside the stdin handler, add one case next to `'s'`:

```js
      case 'y': summonBabyShark(anim); return;
```

`y` is currently unmapped. Case-insensitivity is already handled by the
`toLowerCase()` above the switch, and adding a `case` automatically removes `y`
from the kids-mode random-spawn fallback — intended behavior for all mapped keys.

## Step 4 — Docs

In `CLAUDE.md`, "Controls" → Summon line, add `y baby shark` (keep the existing
entries untouched).

## Step 5 — Verification

```sh
# 1. syntax check every file
node -c asciiquarium.js && for f in src/*.js; do node -c "$f" || echo FAIL; done

# 2. smoke-test the renderer for 2s (no TTY needed)
( node asciiquarium.js > /tmp/aq.out 2> /tmp/aq.err & PID=$!; \
  sleep 2; kill -TERM $PID; wait $PID 2>/dev/null ); cat /tmp/aq.err
# empty stderr + non-empty stdout = pass
```

3. **Interactive check (required — the art must be eyeballed):** run
   `./asciiquarium.js`, press `y` several times. Verify:
   - baby shark appears from either side (press repeatedly until you've seen
     both directions), swims fully across, and despawns offscreen;
   - the art matches the rendered reference in Step 1 — no orphaned backslashes
     or garbage characters (escaping bug), mouth points in the travel direction;
   - eye is white, body cyan, and exactly one white cell per shark
     (mask misalignment shows up as extra/shifted white cells);
   - it does **not** kill fish it swims through (no red splat);
   - something random spawns shortly after it exits (death chain works);
   - `r` (rebuild) and terminal resize while a baby shark is on screen don't crash;
   - spamming `y` 5+ times at once stays stable.

## Edge cases already handled / to preserve

- Tiny terminals: the `Math.max(1, …)` in the y-spawn keeps `Math.random()`'s
  range non-negative — same guard as `createShark`.
- Multiple concurrent baby sharks share no state — each call creates an
  independent entity, so no cleanup bookkeeping is needed.
- Do not add `physical: true` — without a `collHandler` design it would still
  participate in the collision pass for no benefit.
