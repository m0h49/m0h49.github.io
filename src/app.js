import { themes } from './themes.js';

const hostname = window.location.hostname;
let historyIndex = -1;

let currentHistory = [];
let currentTheme = null;

function loadHistory() {
  try {
    const stored = localStorage.getItem('history');
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return [];
}

function saveHistory(h) {
  currentHistory = h;
  try { localStorage.setItem('history', JSON.stringify(h)); } catch (_) {}
}

function loadTheme() {
  try {
    const stored = localStorage.getItem('colorscheme');
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return themes.find(t => t.name === 'GruvboxDark');
}

function saveTheme(t) {
  currentTheme = t;
  try { localStorage.setItem('colorscheme', JSON.stringify(t)); } catch (_) {}
}

currentHistory = loadHistory();
currentTheme = loadTheme();

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderHistory(historyEl) {
  const entries = currentHistory;

  if (!entries || entries.length === 0) {
    historyEl.innerHTML = '';
    return;
  }

  historyEl.innerHTML = entries.map(entry => `
    <div class="history-entry">
      <div class="history-entry-command">
        <span class="terminal-prompt">
          <span class="prompt-guest">guest</span>
          <span class="prompt-at">@</span>
          <span class="prompt-hostname">${hostname}</span>
          <span class="prompt-dollar">:~$</span>
        </span>
        <span class="visible-mobile">&#10093;</span>
        <span class="command-text">${escapeHtml(entry.command)}</span>
      </div>
      ${(entry.outputs || []).map(output => `<pre class="command-output">${escapeHtml(output)}</pre>`).join('')}
    </div>
  `).join('');
}

function applyTheme(t) {
  const existing = document.getElementById('theme-vars');
  if (existing) existing.remove();
  const style = document.createElement('style');
  style.id = 'theme-vars';
  style.textContent = `:root {
    --terminal-bg: ${t.background};
    --terminal-fg: ${t.foreground};
    --terminal-border: ${t.green};
    --terminal-yellow: ${t.yellow};
    --terminal-white: ${t.white};
    --terminal-green: ${t.green};
  }`;
  document.head.appendChild(style);
}

function renderCommands(historyEl) {
  renderHistory(historyEl);
  setTimeout(() => {
    const container = document.querySelector('.terminal-main');
    if (container) container.scrollTop = container.scrollHeight;
  }, 0);
}

const commands = {
  help() {
    return `Available commands:

about       — About me (student, School 21)
calc        — Evaluate a mathematical expression
clear       — Clear terminal history
convert     — Convert between units
curl        — Fetch and display a URL
date        — Show current date and time
donate      — Donation page status
echo        — Repeat the given text
email       — Show contact email
exit        — Close the tab
help        — Show this help message
hostname    — Show current hostname
lore        — Story behind the nickname "49"
neofetch    — Display ASCII banner
projects    — List of projects
repo        — Show GitHub URL
skills      — Show tech stack
social      — Show social links
sudo        — Try to run as root
theme       — List or set color themes
todo        — Manage todo list
vi/vim/emacs — Editor jokes
weather     — Fetch weather for a city
whoami      — Show current user

Type <command> --help for more info.`;
  },
  hostname() { return hostname; },
  whoami() { return 'guest'; },
  date() { return new Date().toLocaleString(); },
  echo(args) { return args.join(' '); },
  vi() { return "why use vi? try 'emacs'"; },
  vim() { return "why use vim? try 'emacs'"; },
  emacs() { return "why use emacs? try 'vim'"; },
  clear() { saveHistory([]); return ''; },
  exit() { return 'Please close the tab to exit.'; },
  repo() { return 'https://github.com/m0h49'; },
  email() { return 'm0h49@mail.ru'; },
  donate() { return 'Страница пожертвований пока не настроена.'; },
  sudo(args) {
    if (args[0] === 'coffee') return '☕';
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    return `Permission denied: unable to run the command '${args[0]}' as root.`;
  },
  about() {
    return `m0h49 (omerpean)
──────────────────────────────
Студент Школы 21 (Сбер).
Разработчик на C, GDScript, Python.
 
Стек: Git, Linux, Godot Engine, Vim.
 
Проекты:
  • fcsRPG / Dodge — игры на Godot
  • C_code_autotyping — тема для Lively Wallpaper
  • rtsp_player — эксперименты с Python
 
Контакты: email, repo, social — введите команду.
Подробнее обо мне: skills, projects, lore.`;
  },
  skills() {
    return `⚡ Languages:  C (учусь не сегфолтиться), GDScript, Python
   (уровень: "понимаю, что делает этот код, но боюсь его трогать")
🎮 Game Dev:   Godot Engine
   (делаю аркады, которые иногда даже выигрываются)
🛠 Tools:      Git, Linux, Vim
   (Git: делаю commit, push, и молюсь богам рандома)
🎓 Status:     Студент Школы 21 (Sber)
   (прошел бассейн и остался в живых)`;
  },
  projects() {
    return `📁 fcsRPG / Dodge — игры на Godot (GDScript)
   Status: Работает! (на моем компьютере, не спрашивай про другие)
📁 C_code_autotyping — тема для Lively Wallpaper
   Status: Простая страница сайта с автокодингом.
📁 rtsp_player — эксперименты с Python
   Status: В процессе осмысления бытия и кода.
More on GitHub → type social`;
  },
  lore() {
    return `📖 Легенда о "49":
Ник m0h49 родился, когда я читал "Код" Чарльза Петцольда.
0x49 = 73 в десятичной системе.
Почему 73?
• Это 21-е простое число (а 37 — 12-е, зеркало)
• В бинарном виде: 1001001 (идеальный палиндром)
• 7×3 = 21 (произведение цифр = индекс числа)
• В ASCII: 0x49 = буква "I" (Identity / Intelligence)
• INT 49h в старых BIOS (трансляция скан-кодов) узнал случайно
Случайностей не бывает. Только хорошо скрытые закономерности.`;
  },
  social() {
    return `🐙 GitHub (личный):   github.com/m0hmad
🐙 GitHub (орг):      github.com/m0h49
💬 Telegram:          @omerpean`;
  },
  neofetch() {
    return `
+================================================+
|                                                |
|  ███╗   ███╗ ██████╗ ██╗  ██╗██╗  ██╗ █████╗   |
|  ████╗ ████║██╔═████╗██║  ██║██║  ██║██╔══██╗  |
|  ██╔████╔██║██║██╔██║███████║███████║╚██████║  |
|  ██║╚██╔╝██║████╔╝██║██╔══██║╚════██║ ╚═══██║  |
|  ██║ ╚═╝ ██║╚██████╔╝██║  ██║     ██║ █████╔╝  |
|  ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝     ╚═╝ ╚════╝   |
|                                                |
+================================================+

about     — кто я такой
skills    — мой текущий "стек"
projects  — что я пытался создать
lore      — почему именно 0h49?
social    — где меня найти
clear     — очистить терминал
sudo coffee — ☕
`;
  },
  theme(args) {
    if (args.length === 0) {
      return 'Usage: theme [args].\n  ls: list all available themes\n  set: set theme to [theme]\n\nExamples:\n  theme ls\n  theme set gruvboxdark';
    }
    if (args[0] === 'ls') {
      return themes.map(t => t.name.toLowerCase()).join('\n') + '\n\nВсего тем: ' + themes.length;
    }
    if (args[0] === 'set') {
      if (!args[1]) return 'Usage: theme set [theme]';
      const found = themes.find(t => t.name.toLowerCase() === args[1]);
      if (!found) return `Theme '${args[1]}' not found. Try 'theme ls' to see all available themes.`;
      saveTheme(found);
      applyTheme(found);
      return `Theme set to ${args[1]}`;
    }
    return 'Usage: theme [args].\n  ls: list all available themes\n  set: set theme to [theme]';
  },
  weather: async (args) => {
    const city = args.join('+');
    if (!city) return 'Usage: weather [city]. Example: weather Brussels';
    try {
      const res = await fetch('https://wttr.in/' + city + '?ATm');
      return await res.text();
    } catch (_) {
      return 'weather: could not fetch weather data';
    }
  },
  curl: async (args) => {
    if (args.length === 0) return 'curl: no URL provided';
    try {
      const res = await fetch(args[0]);
      if (!res.ok) return 'curl: error ' + res.status + ' ' + res.statusText;
      return await res.text();
    } catch (e) {
      return 'curl: could not fetch URL ' + args[0] + '. Details: ' + e;
    }
  },
  calc(args) {
    const expr = args.join(' ').trim();
    if (!expr) return 'Usage: calc <expression>\n\nExamples:\n  calc 2+2\n  calc (3 + 4) * 2 - 1\n  calc 100 / 7\n\nSupported: + - * / % and parentheses.';
    try {
      return '' + evaluate(expr);
    } catch (e) {
      return '' + e.message;
    }
  },
  convert(args) {
    if (args.length !== 4 || args[2] !== 'to') {
      return 'Usage: convert <value> <from> to <to>\n\nExamples:\n  convert 100 km to mi\n  convert 0 C to F\n  convert 1 GiB to MiB\n\nSupported units:\n  length: m, km, cm, mm, mi, ft, in, yd\n  mass: g, kg, mg, lb, oz, t\n  temperature: C, F, K\n  data: B, KB, MB, GB, TB, KiB, MiB, GiB, TiB';
    }
    const value = Number(args[0]);
    if (isNaN(value)) return 'error: ' + args[0] + ' is not a valid number';
    const result = convertUnit(value, args[1], args[3]);
    if (!result.ok) return result.error;
    return value + ' ' + result.fromUnit + ' = ' + result.value + ' ' + result.toUnit;
  },
  todo(args) {
    if (args.length === 0) {
      return 'Usage: todo [command] [args]\n\nCommands:\n  add <text>     Add a new todo\n  ls [filter]    List todos (filter: all, completed, pending)\n  done <id>      Mark todo as completed\n  rm <id>        Remove a todo\n  clear [completed]  Clear todos (add \'completed\' to clear only completed)\n  stats          Show todo statistics\n\nExamples:\n  todo add Buy groceries\n  todo ls\n  todo ls pending\n  todo done 1\n  todo rm 2\n  todo clear completed';
    }
    const sub = args[0];
    const subArgs = args.slice(1);
    switch (sub) {
      case 'add':
        if (subArgs.length === 0) return 'Error: Please provide todo text. Example: todo add Buy milk';
        return todoAdd(subArgs.join(' '));
      case 'ls':
      case 'list':
        if (subArgs[0] && !['all', 'completed', 'pending'].includes(subArgs[0])) return 'Error: Invalid filter. Use: all, completed, or pending';
        return todoList(subArgs[0]);
      case 'done':
      case 'complete':
        return todoDone(parseInt(subArgs[0]));
      case 'rm':
      case 'remove':
      case 'delete':
        return todoRemove(parseInt(subArgs[0]));
      case 'clear':
        return todoClear(subArgs[0] === 'completed');
      case 'stats':
        return todoStats();
      default:
        return 'Unknown todo command: ' + sub + '\n\nUsage: todo [command] [args]';
    }
  }
};

let todoData = { todos: [], nextId: 1 };

function todoLoad() {
  try {
    const stored = localStorage.getItem('terminal-todos');
    if (stored) {
      todoData = JSON.parse(stored);
      todoData.todos = todoData.todos.map(t => ({
        ...t,
        createdAt: new Date(t.createdAt),
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined
      }));
    }
  } catch (_) {}
}

function todoSave() {
  try { localStorage.setItem('terminal-todos', JSON.stringify(todoData)); } catch (_) {}
}

function todoAdd(text) {
  const todo = { id: todoData.nextId++, text, completed: false, createdAt: new Date() };
  todoData.todos.push(todo);
  todoSave();
  return 'Added todo #' + todo.id + ': ' + text;
}

function todoList(filter) {
  let filtered = todoData.todos;
  if (filter === 'completed') filtered = todoData.todos.filter(t => t.completed);
  else if (filter === 'pending') filtered = todoData.todos.filter(t => !t.completed);
  if (filtered.length === 0) return filter ? 'No ' + filter + ' todos found.' : 'No todos found.';
  const list = filtered.map(t => {
    const status = t.completed ? '[*]' : '[ ]';
    return status + ' ' + t.id + ': ' + t.text;
  }).join('\n');
  const total = todoData.todos.length;
  const done = todoData.todos.filter(t => t.completed).length;
  return list + '\n--- Total: ' + total + ' | Completed: ' + done + ' | Pending: ' + (total - done);
}

function todoDone(id) {
  const todo = todoData.todos.find(t => t.id === id);
  if (!todo) return 'Todo #' + id + ' not found.';
  if (todo.completed) return 'Todo #' + id + ' is already completed.';
  todo.completed = true;
  todo.completedAt = new Date();
  todoSave();
  return 'Completed todo #' + id + ': ' + todo.text;
}

function todoRemove(id) {
  const idx = todoData.todos.findIndex(t => t.id === id);
  if (idx === -1) return 'Todo #' + id + ' not found.';
  const removed = todoData.todos.splice(idx, 1)[0];
  todoSave();
  return 'Removed todo #' + id + ': ' + removed.text;
}

function todoClear(onlyCompleted) {
  if (onlyCompleted) {
    const count = todoData.todos.filter(t => t.completed).length;
    todoData.todos = todoData.todos.filter(t => !t.completed);
    todoSave();
    return 'Cleared ' + count + ' completed todo(s).';
  }
  const count = todoData.todos.length;
  todoData.todos = [];
  todoSave();
  return 'Cleared all ' + count + ' todo(s).';
}

function todoStats() {
  const total = todoData.todos.length;
  const completed = todoData.todos.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? (completed / total * 100).toFixed(1) : 0;
  return 'Todo Statistics:\nTotal: ' + total + '\nCompleted: ' + completed + '\nPending: ' + pending + '\nCompletion rate: ' + rate + '%';
}

todoLoad();

class CalcError extends Error {
  constructor(msg) { super(msg); this.name = 'CalcError'; }
}

function evaluate(expr) {
  const p = new Parser(expr);
  const r = p.parseExpression();
  p.expectEnd();
  return r;
}

class Parser {
  constructor(input) { this.input = input; this.pos = 0; }
  parseExpression() {
    let v = this.parseTerm();
    while (true) {
      this.skipWs();
      if (this.startsWith('**') || this.peek() === '^') this.throwOp();
      const op = this.peek();
      if (op === '+' || op === '-') { this.pos++; const r = this.parseTerm(); v = op === '+' ? v + r : v - r; }
      else break;
    }
    return v;
  }
  parseTerm() {
    let v = this.parseFactor();
    while (true) {
      this.skipWs();
      if (this.startsWith('**') || this.peek() === '^') this.throwOp();
      const op = this.peek();
      if (op === '*' || op === '/' || op === '%') {
        this.pos++;
        const r = this.parseFactor();
        if ((op === '/' || op === '%') && r === 0) throw new CalcError('error: division by zero');
        if (op === '*') v = v * r;
        else if (op === '/') v = v / r;
        else v = v % r;
      } else break;
    }
    return v;
  }
  parseFactor() {
    this.skipWs();
    if (this.peek() === '-') { this.pos++; return -this.parseFactor(); }
    if (this.peek() === '+') { this.pos++; return this.parseFactor(); }
    return this.parsePrimary();
  }
  parsePrimary() {
    this.skipWs();
    if (this.peek() === '(') {
      this.pos++;
      const v = this.parseExpression();
      this.skipWs();
      if (this.peek() !== ')') throw new CalcError("error: missing ')'");
      this.pos++;
      return v;
    }
    return this.parseNumber();
  }
  parseNumber() {
    this.skipWs();
    const s = this.pos;
    while (this.pos < this.input.length && /[0-9.]/.test(this.input[this.pos])) this.pos++;
    if (s === this.pos) {
      const ch = this.peek();
      if (ch === '') throw new CalcError('error: unexpected end of expression');
      if (this.startsWith('**') || ch === '^') this.throwOp();
      throw new CalcError("error: unexpected character '" + ch + "'");
    }
    const text = this.input.substring(s, this.pos);
    if ((text.match(/\./g) || []).length > 1) throw new CalcError("error: invalid number '" + text + "'");
    if (text === '.') throw new CalcError("error: invalid number '.'");
    const num = Number(text);
    if (isNaN(num)) throw new CalcError("error: invalid number '" + text + "'");
    return num;
  }
  expectEnd() {
    this.skipWs();
    if (this.pos < this.input.length) {
      if (this.startsWith('**') || this.peek() === '^') this.throwOp();
      throw new CalcError("error: unexpected '" + this.input[this.pos] + "'");
    }
  }
  skipWs() { while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) this.pos++; }
  peek() { return this.input[this.pos] ?? ''; }
  startsWith(s) { return this.input.startsWith(s, this.pos); }
  throwOp() { throw new CalcError("error: unknown operator '" + (this.startsWith('**') ? '**' : '^') + "'"); }
}

const LINEAR_UNITS = {
  m: { category: 'length', factor: 1, canonical: 'm' },
  km: { category: 'length', factor: 1000, canonical: 'km' },
  cm: { category: 'length', factor: 0.01, canonical: 'cm' },
  mm: { category: 'length', factor: 0.001, canonical: 'mm' },
  mi: { category: 'length', factor: 1609.344, canonical: 'mi' },
  ft: { category: 'length', factor: 0.3048, canonical: 'ft' },
  in: { category: 'length', factor: 0.0254, canonical: 'in' },
  yd: { category: 'length', factor: 0.9144, canonical: 'yd' },
  g: { category: 'mass', factor: 1, canonical: 'g' },
  kg: { category: 'mass', factor: 1000, canonical: 'kg' },
  mg: { category: 'mass', factor: 0.001, canonical: 'mg' },
  lb: { category: 'mass', factor: 453.59237, canonical: 'lb' },
  oz: { category: 'mass', factor: 28.349523125, canonical: 'oz' },
  t: { category: 'mass', factor: 1000000, canonical: 't' },
  B: { category: 'data', factor: 1, canonical: 'B' },
  KB: { category: 'data', factor: 1000, canonical: 'KB' },
  MB: { category: 'data', factor: 1000000, canonical: 'MB' },
  GB: { category: 'data', factor: 1000000000, canonical: 'GB' },
  TB: { category: 'data', factor: 1000000000000, canonical: 'TB' },
  KiB: { category: 'data', factor: 1024, canonical: 'KiB' },
  MiB: { category: 'data', factor: 1048576, canonical: 'MiB' },
  GiB: { category: 'data', factor: 1073741824, canonical: 'GiB' },
  TiB: { category: 'data', factor: 1099511627776, canonical: 'TiB' }
};

const TEMP_UNITS = { C: { category: 'temperature', canonical: 'C' }, F: { category: 'temperature', canonical: 'F' }, K: { category: 'temperature', canonical: 'K' } };

function lookupUnit(unit) {
  if (LINEAR_UNITS[unit]) return LINEAR_UNITS[unit];
  const upper = unit.toUpperCase();
  if (TEMP_UNITS[upper] && unit.length === 1) return TEMP_UNITS[upper];
  const lower = unit.toLowerCase();
  if (LINEAR_UNITS[lower]) return LINEAR_UNITS[lower];
  return null;
}

function toKelvin(value, unit) {
  if (unit === 'K') return value;
  if (unit === 'C') return value + 273.15;
  return (value - 32) * 5 / 9 + 273.15;
}

function fromKelvin(value, unit) {
  if (unit === 'K') return value;
  if (unit === 'C') return value - 273.15;
  return (value - 273.15) * 9 / 5 + 32;
}

function convertUnit(value, from, to) {
  const fromMeta = lookupUnit(from);
  const toMeta = lookupUnit(to);
  if (!fromMeta) return { ok: false, error: "error: unknown unit '" + from + "'" };
  if (!toMeta) return { ok: false, error: "error: unknown unit '" + to + "'" };
  if (fromMeta.category !== toMeta.category) return { ok: false, error: 'error: cannot convert ' + fromMeta.category + ' to ' + toMeta.category };
  if (fromMeta.category === 'temperature') {
    const k = toKelvin(value, fromMeta.canonical);
    return { ok: true, value: fromKelvin(k, toMeta.canonical), fromUnit: fromMeta.canonical, toUnit: toMeta.canonical };
  }
  return { ok: true, value: value * fromMeta.factor / toMeta.factor, fromUnit: fromMeta.canonical, toUnit: toMeta.canonical };
}

function handleKeyDown(e, inputEl, historyEl) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const fullCommand = inputEl.value.trim();
    if (!fullCommand) return;

    const parts = fullCommand.split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);
    const commandFn = commands[commandName];

    if (commandFn) {
      let result;
      try {
        result = commandFn(args);
      } catch (e) {
        saveHistory([...currentHistory, { command: fullCommand, outputs: [commandName + ': ' + e.message] }]);
        if (historyEl) renderCommands(historyEl);
        inputEl.value = '';
        historyIndex = -1;
        return;
      }
      if (result && typeof result.then === 'function') {
        result.then(out => {
          if (commandName !== 'clear') {
            saveHistory([...currentHistory, { command: fullCommand, outputs: [out] }]);
          }
          if (historyEl) renderCommands(historyEl);
        }).catch(e => {
          saveHistory([...currentHistory, { command: fullCommand, outputs: [commandName + ': ' + e.message] }]);
          if (historyEl) renderCommands(historyEl);
        });
      } else {
        if (commandName !== 'clear') {
          saveHistory([...currentHistory, { command: fullCommand, outputs: [result] }]);
        }
        if (historyEl) renderCommands(historyEl);
      }
    } else {
      saveHistory([...currentHistory, { command: fullCommand, outputs: [commandName + ': command not found'] }]);
      if (historyEl) renderCommands(historyEl);
    }

    inputEl.value = '';
    historyIndex = -1;
  } else if (e.key === 'ArrowUp') {
    if (historyIndex < currentHistory.length - 1) {
      historyIndex++;
      inputEl.value = currentHistory[currentHistory.length - 1 - historyIndex].command;
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (historyIndex >= 0) {
      historyIndex--;
      inputEl.value = historyIndex >= 0 ? currentHistory[currentHistory.length - 1 - historyIndex].command : '';
    }
    e.preventDefault();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const match = Object.keys(commands).find(c => c.startsWith(inputEl.value));
    if (match) inputEl.value = match;
  } else if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    saveHistory([]);
    if (historyEl) renderCommands(historyEl);
  }
}

export function init(container) {
  applyTheme(currentTheme);

  container.innerHTML = `
    <main class="terminal-main">
      <div id="history" class="terminal-history"></div>
      <div class="terminal-input-line">
        <span class="terminal-prompt">
          <span class="prompt-guest">guest</span>
          <span class="prompt-at">@</span>
          <span class="prompt-hostname">${hostname}</span>
          <span class="prompt-dollar">:~$</span>
        </span>
        <span class="visible-mobile">&#10093;</span>
        <input type="text" id="command-input" class="terminal-input" autofocus autocomplete="off" spellcheck="false" />
      </div>
    </main>
  `;

  const historyEl = container.querySelector('#history');
  const inputEl = container.querySelector('#command-input');

  if (inputEl) inputEl.focus({ preventScroll: true });

  if (currentHistory.length === 0) {
    saveHistory([{ command: 'neofetch', outputs: [commands.neofetch()] }]);
  }

  if (historyEl) renderCommands(historyEl);

  if (inputEl) {
    inputEl.addEventListener('keydown', function(e) {
      handleKeyDown(e, inputEl, historyEl);
    });
  }

  if (container) {
    container.addEventListener('click', function() {
      if (inputEl) inputEl.focus({ preventScroll: true });
    });
  }
}

const appContainer = document.getElementById('app');
if (appContainer) {
  init(appContainer);
}
