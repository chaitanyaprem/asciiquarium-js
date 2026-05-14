# Asciiquarium (Node.js)

Enjoy the mysteries of the sea from the safety of your own terminal.

This is a Node.js port of [Kirk Baucom's original Perl
`asciiquarium`](http://www.robobunny.com/projects/asciiquarium/) (v1.1), with
new fish species backported from the Android live wallpaper by Claudio
Matsuoka. The original Perl script and `README` are still in this repo for
reference.

## What's different from the Perl original

- Rewritten in plain JavaScript for Node — **zero dependencies** (no
  `Term::Animation`, no `Curses`). Renders via raw ANSI escapes, so it runs
  anywhere Node does, including Windows terminals.
- Press <kbd>j</kbd> to drop a fishhook on demand.
- Press <kbd>s</kbd> to summon a shark.
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

| Key | Action |
|-----|--------|
| <kbd>q</kbd> | quit |
| <kbd>r</kbd> | redraw (rebuild all entities) |
| <kbd>p</kbd> | toggle pause |
| <kbd>j</kbd> | drop a fishhook |
| <kbd>s</kbd> | summon a shark |

### Command-line arguments

- `-c` — "classic" mode (accepted for compatibility; visually identical to
  default in this port, which currently ships only the classic fish set).

## License

GPL-2.0-or-later — same as the original Perl asciiquarium. See `LICENSE`.

## Credits

- Original Perl `asciiquarium`: **Kirk Baucom** &lt;kbaucom@schizoid.com&gt;
- New fish species and improvements: **Claudio Matsuoka**
- ASCII art: **Joan Stark** (and original asciiquarium contributors)
- Node.js port: **Takuya Matsuyama**
