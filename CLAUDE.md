# Asciiquarium (Node port)

Node.js rewrite of the Perl `asciiquarium` (the original `asciiquarium` script and `README` live alongside in this repo). Zero dependencies; runs on plain Node ≥ 14.

Entry point: `./asciiquarium.js` (CLI). The original Perl lives at `./asciiquarium` and is no longer used.

## Layout

```
asciiquarium.js          # entry: argv, terminal setup, main tick loop
src/
  engine.js              # Entity + Animation classes, shape/mask parsing, render
  colors.js              # ansiColor(), randColor(), COLOR_CODE/LETTERS
  depth.js               # Z-depth constants (lower z = drawn on top)
  environment.js         # waterlines + castle
  seaweed.js             # 2-frame swaying stalks, time-based respawn
  bubble.js              # rising bubble + waterline collision
  splat.js               # red 4-frame splat when a small fish dies
  fish.js                # OLD_FISH art + addAllFish/addFish/fishCallback/fishCollision
  shark.js               # shark + invisible "teeth" collider, sharkDeath
  ship.js
  whale.js               # whale + animated water spout (12-frame anim)
  monster.js             # old Loch-Ness-style 4-frame monster
  bigfish.js             # big_fish_1 (yellow, body-colored mask)
  swan.js                # surface swan
  ducks.js               # 3-duck formation, looking-around frames
  dolphins.js            # 3-dolphin pod jumping in formation (path-cycle callback)
  random.js              # randomObject() dispatcher; wires all of the above
```

## Module wiring

```
asciiquarium.js
 ├── engine.js          ─→ colors.js
 ├── environment.js     ─→ depth.js
 ├── seaweed.js         ─→ depth.js
 ├── fish.js            ─→ depth, colors, engine, bubble, splat
 └── random.js          ─→ shark, ship, whale, monster, bigfish
                              ↑ each of these requires random.js back
                                (circular — see below)
```

**Circular-dep handling** (`random.js` ↔ random-object modules): the leaf modules each do `const random = require('./random')` at the top and read `random.randomObject` *inside* `addX()` calls. `random.js` attaches its exports via `exports.randomObject = …` (mutation, not reassignment) so the partial reference handed out during the circular load gets populated by the time `addX()` actually runs. Don't replace `module.exports = {…}` in `random.js` — it'll break the circle.

## Engine concepts

`Entity` options (mirror Perl `Term::Animation::Entity`):

| Option | Meaning |
|---|---|
| `shape` | string or `[string]` of frames. Leading/trailing `\n` stripped. |
| `color` | mask same shape as art. Space = `defaultColor`; letter = override. |
| `autoTrans` | `true` → spaces in `shape` are transparent (replaced with `\0` internally). |
| `transparent` | char → also transparent. |
| `position` | `[x, y, z]`. Lower z = drawn on top. |
| `callbackArgs` | `[dx, dy, dz, frameSpeed]`. Fractional values OK (accumulated). |
| `callback` | custom per-tick function `(entity, anim) => void`. Default = `moveEntity`. |
| `physical` + `collHandler` | AABB collision; handler runs when overlapping any other physical entity. |
| `dieOffscreen` / `dieTime` / `dieFrame` | death triggers. |
| `deathCb` | runs after the entity is swept from the world. |

`Animation.animate()` runs each tick (100 ms): callbacks → death checks → collisions → death callbacks → render.

Rendering is painter's-algorithm onto a `w×h` char/color grid, then ANSI cursor-position writes per row. Transparent cells (`\0`) keep whatever was drawn underneath.

## Color masks

Body-part placeholders in fish masks (digits → colors via `randColor()`):

```
1 body  2 dorsal  3 flippers  4 eye  5 mouth  6 tailfin  7 gills
```

`4` always becomes `W` (white eye); the other digits are replaced with a random letter from `COLOR_LETTERS`. Lowercase = normal, uppercase = bold/bright. Space in a mask = fall back to `defaultColor`.

## Conventions

- CommonJS (`require`/`module.exports`). `package.json` pins `"type": "commonjs"`.
- Each entity module exports `addX` (and maybe `addAllX`, `deathHelpers`).
- No external dependencies — render via raw ANSI escapes.
- ASCII art in template literals: escape `\` as `\\` and `` ` `` as `` \` ``. Leading/trailing newline in the literal is stripped by `parseFrame()`.
- The original Perl had non-ASCII bytes that round-tripped as `?` in some art (shark, whale, big-fish curves). Those were replaced with spaces and rely on `autoTrans` for transparency — looks cleaner than rendering literal `?`.

## Controls

System: `Ctrl+C` / `SIGINT` quit · `r` redraw · `p` pause · `resize` rebuilds. `q` is intentionally NOT a quit key (toddlers find it) — Ctrl+C is the only exit.

Summon: `s` shark · `d` ducks · `w` whale · `n` swan · `k` dolphins · `h` ship · `g` big fish · `m` monster · `f` extra fish · `b` bubble burst (up to 6 random fish blow an extra-large 5-frame bubble — see `addBigBubble` in `src/bubble.js`).

Case-insensitive. Most summoners' `deathCb` is `random.randomObject`, so each manual summon chains one extra random event when the creature leaves — intentional, gives more activity per keystroke. Exception: `s` uses `summonShark` (cleanup only, no chain).

Kids mode (`-k` / `--kids`): any key not in the summon table falls back to `randomObject` so every smash spawns something.

## Known scope cuts from the Perl original

- Only the `add_old_fish` set (10 fish) is bundled. `-c` is accepted but visually identical to default.
- `new_monster` and `big_fish_2` aren't ported.

## Running

```sh
./asciiquarium.js
# or
node asciiquarium.js
```

## Quick verification when changing code

```sh
# syntax check every file
node -c asciiquarium.js && for f in src/*.js; do node -c "$f" || echo FAIL; done

# smoke-test the renderer for 2s (no TTY needed; output is just ANSI bytes)
( node asciiquarium.js > /tmp/aq.out 2> /tmp/aq.err & PID=$!; \
  sleep 2; kill -TERM $PID; wait $PID 2>/dev/null ); cat /tmp/aq.err
```

Empty stderr + non-empty stdout = working.
