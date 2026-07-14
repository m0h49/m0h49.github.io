# +============================================================+
# |                                                            |
# |        __  _   _ _  ___       _ _   _        _      _      |
# |  _ __ /  \| |_| | |/ _ \ __ _(_) |_| |_ _  _| |__  (_)___  |
# | | '  \ () | ' \_  _\_, // _` | |  _| ' \ || | '_ \_| / _ \ |
# | |_|_|_\__/|_||_||_| /_(_)__, |_|\__|_||_\_,_|_.__(_)_\___/ |
# |                         |___/                              |
# |                                                            |
# +============================================================+

# m0h49 Terminal

Portfolio website with a built-in browser terminal. Student at School 21, coding in C, GDScript and Python.

## Project Structure

```
terminal/
├── index.html               # Main page (entry point)
├── index.html.backup.md     # Old version backup (Snake game)
├── LICENSE                  # MIT License
├── privacypolicy.html       # Privacy policy (Dodge the Creeps)
├── fonts/
│   └── CascadiaCode.ttf     # Monospace font
└── src/
    ├── app.js               # Terminal core logic (628 lines)
    ├── app.css              # Terminal & site styles (409 lines)
    └── themes.js            # 225 color themes (4728 lines)
```

Pure HTML/JS/CSS — no bundlers or package managers.

---

## Architecture (`src/app.js`)

### Initialization
- `init(container)` — exported function, renders the terminal into the given DOM element
- Applies the saved theme on start (default: GruvboxDark)
- If history is empty, runs `banner` automatically

### State (localStorage)
| Key              | Format                    | Description              |
|------------------|---------------------------|--------------------------|
| `history`        | `[{command, outputs}]`    | Command history          |
| `colorscheme`    | `{name, background, ...}` | Active color scheme      |
| `terminal-todos` | `{todos, nextId}`         | Todo list                |

### Input handling (`handleKeyDown`)
| Key        | Action                              |
|------------|-------------------------------------|
| `Enter`    | Execute command, save to history    |
| `ArrowUp`  | History: previous command           |
| `ArrowDown`| History: next command               |
| `Tab`      | Autocomplete command name           |
| `Ctrl+L`   | Clear history (like `clear`)        |

### Rendering
- prompt: `guest@<hostname>:~$`
- Colors from the active theme
- Mobile: prompt collapses to `❯`

---

## Terminal Commands

### m0h49
| Command    | Description                                                |
|------------|------------------------------------------------------------|
| `about`    | Who I am: School 21 student, writes C/GDScript/Python      |
| `skills`   | Stack: C, GDScript, Python, Godot, Git, Linux, Vim        |
| `projects` | Projects: fcsRPG/Dodge, C_code_autotyping, rtsp_player     |
| `lore`     | The "49" legend: 0x49=73, 21st prime, palindrome           |
| `social`   | GitHub (personal/org), Telegram                            |

### System
| Command   | Description                   |
|-----------|-------------------------------|
| `help`    | List commands by category     |
| `clear`   | Clear terminal history        |
| `date`    | Current date and time         |
| `exit`    | Ask to close the tab          |

### Productivity
| Command    | Description                                         |
|------------|-----------------------------------------------------|
| `todo`     | Task manager (add/ls/done/rm/clear/stats)           |
| `weather`  | Weather in a city via wttr.in                       |

### Math
| Command    | Description                                |
|------------|--------------------------------------------|
| `calc`     | Calculator (+, -, *, /, %, parentheses)    |
| `convert`  | Unit converter (length, mass, temp, data)  |

### Customization
| Command    | Description                                |
|------------|--------------------------------------------|
| `theme`    | Theme management (ls/set) (225 themes)     |
| `banner`   | Welcome banner                             |

### Network
| Command      | Description                       |
|--------------|-----------------------------------|
| `curl`       | HTTP request to a URL             |
| `hostname`   | Hostname from `window.location`   |
| `whoami`     | Always `guest`                    |

### Contact
| Command  | Description                                  |
|----------|----------------------------------------------|
| `email`  | m0h49@mail.ru                                |
| `repo`   | https://github.com/m0h49                     |
| `donate` | Placeholder (page not set up yet)            |

### Fun
| Command  | Description                        |
|----------|------------------------------------|
| `echo`   | Print the given text               |
| `sudo`   | Rickroll / `sudo coffee` → ☕      |
| `vi`     | Joke about emacs                   |
| `vim`    | Joke about emacs                   |
| `emacs`  | Joke about vim                     |

---

## Calculator (`calc`)

Custom recursive descent parser (`Parser`, `CalcError`).

```
Expression → Term (('+' | '-') Term)*
Term       → Factor (('*' | '/' | '%') Factor)*
Factor     → ('-' | '+')? Primary
Primary    → '(' Expression ')' | Number
Number     → [0-9]+ ('.' [0-9]+)?
```

- `**` and `^` — not supported, throws an error
- Division/modulo by zero → `CalcError`
- Unary `+` and `-`
- Arbitrary nested parentheses

---

## Unit Converter (`convert`)

Usage: `convert <value> <from> to <to>`

| Category    | Units                                                       |
|-------------|-------------------------------------------------------------|
| Length      | `m`, `km`, `cm`, `mm`, `mi`, `ft`, `in`, `yd`              |
| Mass        | `g`, `kg`, `mg`, `lb`, `oz`, `t`                            |
| Temperature | `C`, `F`, `K`                                               |
| Data        | `B`, `KB`, `MB`, `GB`, `TB`, `KiB`, `MiB`, `GiB`, `TiB`    |

Linear units convert via factor, temperature via Kelvin.

---

## Themes (`src/themes.js`)

- Array of **225 objects** with fields: `name`, `background`, `foreground`, 16 ANSI colors
- Commands: `theme ls` / `theme set <name>`
- Persisted in `localStorage('colorscheme')`
- Default: **GruvboxDark**

---

## Styling (`src/app.css`)

- `@font-face` for Cascadia Code
- Navbar with logo and section links
- Hero section with ASCII art
- About / Skills / Project cards
- Terminal frame with titlebar (red/yellow/green dots)
- prompt: `guest@hostname:~$`
- Social links, footer
- Responsive design, hidden scrollbars

---

## Pages

- `index.html` — landing page with portfolio and terminal
- `privacypolicy.html` — privacy policy for "Dodge the Creeps" (Godot, Android)

---

## Deployment

Any static HTTP server:

```bash
npx serve .
```
