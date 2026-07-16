```
                 /$$$$$$  /$$       /$$   /$$  /$$$$$$
                /$$$_  $$| $$      | $$  | $$ /$$__  $$
  /$$$$$$/$$$$ | $$$$\ $$| $$$$$$$ | $$  | $$| $$  \ $$     /$$$$$$  /$$ /$$$$$$  | $$$$$$$  /$$   /$$| $$$$$$$     /$$  /$$$$$$
 | $$_  $$_  $$| $$ $$ $$| $$__  $$| $$$$$$$$|  $$$$$$$    /$$__  $$| $$|_  $$_/  | $$__  $$| $$  | $$| $$__  $$   | $$ /$$__  $$
 | $$ \ $$ \ $$| $$\ $$$$| $$  \ $$|_____  $$ \____  $$   | $$  \ $$| $$  | $$    | $$  \ $$| $$  | $$| $$  \ $$   | $$| $$  \ $$
 | $$ | $$ | $$| $$ \ $$$| $$  | $$      | $$ /$$  \ $$   | $$  | $$| $$  | $$ /$$| $$  | $$| $$  | $$| $$  | $$   | $$| $$  | $$
 | $$ | $$ | $$|  $$$$$$/| $$  | $$      | $$|  $$$$$$//$$|  $$$$$$$| $$  |  $$$$/| $$  | $$|  $$$$$$/| $$$$$$$//$$| $$|  $$$$$$/
 |__/ |__/ |__/ \______/ |__/  |__/      |__/ \______/|__/ \____  $$|__/   \___/  |__/  |__/ \______/ |_______/|__/|__/ \______/
                                                           /$$  \ $$
                                                          |  $$$$$$/
                                                           \______/
```

# m0h49 Terminal

Portfolio website with an interactive browser terminal. Student at School 21, coding in C, GDScript and Python.

Live demo: [m0h49.github.io](https://github.com/m0h49)

---

## Table of Contents

- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Terminal Commands](#terminal-commands)
- [Architecture](#architecture)
- [Editing Content](#editing-content)
  - [Page Sections](#page-sections)
  - [Terminal Commands](#terminal-commands-1)
  - [Themes](#themes)
  - [Todo List](#todo-list)
  - [Font](#font)
  - [CSS Styles](#css-styles)
- [Deployment](#deployment)
- [License](#license)

---

## Project Structure

```
m0h49.opencode/
├── index.html                # Главная страница (точка входа)
├── LICENSE                   # MIT License
├── privacypolicy.html        # Политика конфиденциальности для Android-приложения
├── fonts/
│   └── CascadiaCode.ttf      # Моноширинный шрифт
├── src/
│   ├── app.js                # Логика терминала (649 строк)
│   ├── app.css               # Все стили — сайт + терминал (409 строк)
│   └── themes.js             # 225 цветовых тем iTerm2 (4728 строк)
├── README.md                 # Документация (английский)
└── README_RUS.md             # Документация (русский)
```

Pure HTML/CSS/JS — no bundlers, frameworks, or package managers.

---

## Quick Start

```bash
git clone https://github.com/m0h49/m0h49
cd m0h49
npx serve .
```

Open `http://localhost:3000` in your browser.

---

## Terminal Commands

```
help        — show command list
about       — about me
calc        — expression calculator
clear       — clear terminal
convert     — unit converter
curl        — HTTP request to a URL
date        — current date and time
donate      — donation page status
echo        — echo text back
email       — contact email
exit        — close the tab
hostname    — show hostname
lore        — "49" nickname story
neofetch    — ASCII logo banner
projects    — list of projects
repo        — GitHub URL
skills      — tech stack
social      — social links
sudo        — run as root (sudo coffee — ☕)
theme       — theme management (ls/set)
todo        — task manager
vi/vim/emacs — editor jokes
weather     — weather for a city
whoami      — guest
```

See `commands.md` or type `help` in the terminal for details.

---

## Architecture

### Initialization (`src/app.js`)

Entry point — `init(container)`. It:
1. Applies the saved theme (default: GruvboxDark)
2. Renders the terminal HTML into the container
3. Auto-runs `neofetch` if history is empty
4. Attaches keyboard and click handlers

### Input Handling (`handleKeyDown`)

| Key            | Action                        |
|----------------|-------------------------------|
| `Enter`        | Execute command               |
| `Arrow Up`     | History: previous command     |
| `Arrow Down`   | History: next command         |
| `Tab`          | Autocomplete command name     |
| `Ctrl + L`     | Clear history                 |

### State (localStorage)

| Key               | Format                        | Description               |
|-------------------|-------------------------------|---------------------------|
| `history`         | `[{command, outputs}]`        | Command history           |
| `colorscheme`     | `{name, background, ...}`     | Active theme              |
| `terminal-todos`  | `{todos, nextId}`             | Todo list                 |

### Data Flow

```
Input → handleKeyDown → commands[commandName](args)
  ↓                        ↓
  sync return        or Promise (weather, curl)
  ↓                        ↓
  saveHistory() → localStorage + renderCommands()
  ↓
  renderHistory() → DOM update
```

---

## Editing Content

### Page Sections

All content lives in `index.html`. Sections are ordered as follows:

```html
<!-- hero — title and ASCII art -->
<section id="hero" class="section hero">
  <pre class="hero-ascii">...</pre>
</section>

<!-- terminal — interactive terminal -->
<section id="terminal" class="section terminal-section">...</section>

<!-- about — bio text -->
<section id="about" class="section">
  <div class="card">
    <p>Your text here</p>
  </div>
</section>

<!-- skills — skills grid -->
<section id="skills" class="section">
  <div class="skills-grid">
    <div class="skill-card">
      <span class="skill-label">Language</span>
      <span class="skill-value">C, Python</span>
    </div>
  </div>
</section>

<!-- projects — project cards -->
<section id="projects" class="section">...</section>

<!-- social — links -->
<section id="social" class="section">...</section>
```

To add a new section, insert a `<section>` block with a unique `id` and add a nav link:

```html
<a href="#newsection">newsection</a>
```

### Terminal Commands

Commands are defined in the `commands` object in `src/app.js` (line 93).

**Add a simple command:**

```javascript
hello() {
  return 'Hello, world!';
},
```

It becomes immediately available in the terminal and Tab autocomplete.

**Add a command with arguments:**

```javascript
greet(args) {
  if (args.length === 0) return 'Usage: greet <name>';
  return 'Hello, ' + args.join(' ') + '!';
},
```

**Add an async command:**

```javascript
ping: async (args) => {
  const res = await fetch('https://api.example.com/ping');
  return await res.text();
},
```

Rules:
- Each command is a method of the `commands` object
- Receives `args` array (space-separated words after the command name)
- Returns a string (sync) or Promise&lt;string&gt; (async)
- Errors are caught automatically by the try/catch in `handleKeyDown`

### Themes

The file `src/themes.js` exports an array of theme objects. Each theme:

```javascript
{
  name: 'GruvboxDark',
  background: '#282828',
  foreground: '#ebdbb2',
  black: '#282828',
  red: '#cc241d',
  green: '#98971a',
  yellow: '#d79921',
  blue: '#458588',
  purple: '#b16286',
  cyan: '#689d6a',
  white: '#a89984',
  brightBlack: '#928374',
  brightRed: '#fb4934',
  brightGreen: '#b8bb26',
  brightYellow: '#fabd2f',
  brightBlue: '#83a598',
  brightPurple: '#d3869b',
  brightCyan: '#8ec07c',
  brightWhite: '#ebdbb2'
}
```

To add a new theme, just append an object to the array. `theme ls` will pick it up automatically.

### Todo List

Data is stored in localStorage under `terminal-todos`:

```json
{
  "todos": [
    {
      "id": 1,
      "text": "Buy milk",
      "completed": false,
      "createdAt": "2025-07-17T12:00:00.000Z",
      "completedAt": null
    }
  ],
  "nextId": 2
}
```

Clearing localStorage will reset all tasks.

### Font

The font file is at `fonts/CascadiaCode.ttf`. To replace it:

1. Place a new `.ttf` file in `fonts/`
2. In `src/app.css`, update `src: url('fonts/YourFont.ttf')` and the `font-family` name

### CSS Styles

All styles are in `src/app.css`. Key classes:

| Class               | Purpose                        |
|---------------------|---------------------------------|
| `.navbar`           | Top navigation bar              |
| `.site-content`     | Main content container          |
| `.hero`             | Hero section                    |
| `.card`             | About card                      |
| `.skills-grid`      | Skills grid                     |
| `.projects-grid`    | Projects grid                   |
| `.terminal-frame`   | Terminal outer frame            |
| `.terminal-main`    | Terminal inner area (scrollable)|
| `.terminal-history` | Command history container       |
| `.terminal-input`   | Command input field             |
| `.social-links`     | Social links container          |
| `.footer`           | Footer                          |

Colors are controlled via CSS custom properties: `--terminal-bg`, `--terminal-fg`, `--terminal-border`, `--terminal-yellow`, `--terminal-white`, `--terminal-green`. These are updated dynamically when a theme is applied.

---

## Deployment

Any static HTTP server:

```bash
# via npx
npx serve .

# via Python
python -m http.server 3000

# via VS Code Live Server
# install Live Server extension → right-click index.html → Open with Live Server
```

For GitHub Pages: enable it in repo settings (branch `main`, root `/`).

---

## License

MIT License. Copyright (c) 2024 m0h49.
Based on [terminal](https://github.com/m4tt72/terminal) by Yassine Fathi.
