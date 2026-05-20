# Asciiquarium (Node.js)

![screenshot](./docs/screenshot.png)

Enjoy the mysteries of the sea from the safety of your own terminal.

This is a Node.js port of [Kirk Baucom's original Perl
`asciiquarium`](http://www.robobunny.com/projects/asciiquarium/) (v1.1), with
new fish species backported from the Android live wallpaper by Claudio
Matsuoka.

## What's different from the Perl original

- Rewritten in plain JavaScript for Node — **zero dependencies** (no
  `Term::Animation`, no `Curses`). Renders via raw ANSI escapes, so it runs
  anywhere Node does, including Windows terminals.
- Press <kbd>s</kbd> to summon a shark (and lots of other keys to summon other creatures — see Controls below).
- Toddler-friendly: <kbd>q</kbd> is **not** a quit key; only <kbd>Ctrl</kbd>+<kbd>C</kbd> exits. Add `--kids` to make every unmapped key spawn something random.
- Handles terminal `resize` by rebuilding the world.

Most of the ASCII art is by Joan Stark; the rest is from the original
asciiquarium sources.

## Requirements

- Node.js ≥ 14

## Install

```sh
npm install -g @craftzdog/asciiquarium
```

Or run from a clone:

```sh
git clone https://github.com/craftzdog/asciiquarium-js.git
cd asciiquarium-js
./asciiquarium.js
```

## Usage

```sh
asciiquarium
```

### Controls

| Key                                | Action                                        |
| ---------------------------------- | --------------------------------------------- |
| <kbd>Ctrl</kbd>+<kbd>C</kbd>       | quit (only exit — <kbd>q</kbd> is disabled)   |
| <kbd>r</kbd>                       | redraw (rebuild all entities)                 |
| <kbd>p</kbd>                       | toggle pause                                  |
| <kbd>s</kbd>                       | summon a shark                                |
| <kbd>d</kbd>                       | send in ducks                                 |
| <kbd>w</kbd>                       | summon a whale                                |
| <kbd>n</kbd>                       | send a swan gliding by                        |
| <kbd>k</kbd>                       | send a jumping dolphin pod                    |
| <kbd>h</kbd>                       | sail a ship across                            |
| <kbd>g</kbd>                       | spawn a big fish                              |
| <kbd>m</kbd>                       | spawn a sea monster                           |
| <kbd>f</kbd>                       | add an extra fish                             |
| <kbd>b</kbd>                       | bubble burst — up to 6 fish blow big bubbles  |

All summon keys are case-insensitive.

### Command-line arguments

- `-c` — "classic" mode (accepted for compatibility; visually identical to
  default in this port, which currently ships only the classic fish set).
- `-k` / `--kids` — toddler mode: every key not listed above spawns a random
  creature, so keyboard-smashing always produces something fun.

## License

GPL-2.0-or-later — same as the original Perl asciiquarium. See `LICENSE`.

## Credits

- Original Perl `asciiquarium`: **Kirk Baucom** &lt;kbaucom@schizoid.com&gt;
- New fish species and improvements: **Claudio Matsuoka**
- ASCII art: **Joan Stark** (and original asciiquarium contributors)
- Node.js port: **Takuya Matsuyama**
