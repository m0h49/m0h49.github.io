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

Веб-сайт-портфолио с интерактивным браузерным терминалом. Студент Школы 21, пишу на C, GDScript и Python.

Живая версия: [m0h49.github.io](https://github.com/m0h49)

---

## Оглавление

- [Структура проекта](#структура-проекта)
- [Быстрый старт](#быстрый-старт)
- [Команды терминала](#команды-терминала)
- [Архитектура](#архитектура)
- [Редактирование контента](#редактирование-контента)
  - [Секции на странице](#секции-на-странице)
  - [Команды терминала](#команды-терминала-1)
  - [Темы](#темы)
  - [Список задач (todo)](#список-задач-todo)
  - [Шрифт](#шрифт)
  - [CSS-стили](#css-стили)
- [Развёртывание](#развёртывание)
- [Лицензия](#лицензия)

---

## Структура проекта

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

Чистый HTML/CSS/JS — без сборщиков, фреймворков и пакетных менеджеров.

---

## Быстрый старт

```bash
# Клонировать
git clone https://github.com/m0h49/m0h49
cd m0h49

# Запустить локальный сервер
npx serve .
```

Откройте `http://localhost:3000` в браузере.

---

## Команды терминала

```
help        — показать список команд
about       — информация обо мне
calc        — калькулятор выражений
clear       — очистить терминал
convert     — конвертер единиц измерения
curl        — http-запрос к URL
date        — текущая дата и время
donate      — страница пожертвований
echo        — повтор текста
email       — контактный email
exit        — закрыть вкладку
hostname    — имя хоста
lore        — история ника "49"
neofetch    — ASCII-баннер с логотипом
projects    — список проектов
repo        — ссылка на GitHub
skills      — стек технологий
social      — социальные ссылки
sudo        — выполнить от root (sudo coffee — ☕)
theme       — управление темами (ls/set)
todo        — менеджер задач
vi/vim/emacs — шутки про редакторы
weather     — погода в городе
whoami      — guest
```

Подробнее: `commands.md` или `help` в самом терминале.

---

## Архитектура

### Инициализация (`src/app.js`)

Точка входа — `init(container)`. Функция:
1. Применяет сохранённую тему (по умолчанию GruvboxDark)
2. Рендерит HTML-разметку терминала в контейнер
3. Если история пуста — автоматически запускает `neofetch`
4. Навешивает обработчики клавиатуры и кликов

### Обработка ввода (`handleKeyDown`)

| Клавиша       | Действие                        |
|---------------|----------------------------------|
| `Enter`       | Выполнить команду                |
| `Стрелка вверх` | История: предыдущая команда    |
| `Стрелка вниз`  | История: следующая команда     |
| `Tab`         | Автодополнение имени команды     |
| `Ctrl + L`    | Очистить историю                 |

### Состояние (localStorage)

| Ключ               | Формат                         | Назначение                    |
|--------------------|--------------------------------|-------------------------------|
| `history`          | `[{command, outputs}]`         | История команд                |
| `colorscheme`      | `{name, background, ...}`      | Активная тема                 |
| `terminal-todos`   | `{todos, nextId}`              | Список задач                  |

### Поток данных

```
Ввод → handleKeyDown → commands[commandName](args)
  ↓                          ↓
  синхронный return    или Promise (weather, curl)
  ↓                          ↓
  saveHistory() → localStorage + renderCommands()
  ↓
  renderHistory() → обновление DOM
```

---

## Редактирование контента

### Секции на странице

Всё редактируется в `index.html`. Секции расположены по порядку:

```html
<!-- hero — заголовок и ASCII-арт -->
<section id="hero" class="section hero">
  <pre class="hero-ascii">...</pre>
</section>

<!-- terminal — интерактивный терминал -->
<section id="terminal" class="section terminal-section">...</section>

<!-- about — текст о себе -->
<section id="about" class="section">
  <div class="card">
    <p>Ваш текст</p>
  </div>
</section>

<!-- skills — навыки (сетка карточек) -->
<section id="skills" class="section">
  <div class="skills-grid">
    <div class="skill-card">
      <span class="skill-label">Язык</span>
      <span class="skill-value">C, Python</span>
    </div>
  </div>
</section>

<!-- projects — проекты (сетка карточек) -->
<section id="projects" class="section">...</section>

<!-- social — ссылки -->
<section id="social" class="section">...</section>
```

Чтобы добавить новую секцию, вставьте блок `<section>` с нужным `id` и не забудьте добавить ссылку на неё в навбар:

```html
<a href="#newsection">newsection</a>
```

### Команды терминала

Команды описаны в объекте `commands` в файле `src/app.js` (строка 93).

**Добавить простую команду:**

```javascript
hello() {
  return 'Hello, world!';
},
```

После добавления она сразу станет доступна в терминале и в Tab-автодополнении.

**Добавить команду с аргументами:**

```javascript
greet(args) {
  if (args.length === 0) return 'Usage: greet <name>';
  return 'Hello, ' + args.join(' ') + '!';
},
```

**Добавить асинхронную команду:**

```javascript
ping: async (args) => {
  // async/await работают напрямую
  const res = await fetch('https://api.example.com/ping');
  return await res.text();
},
```

Правила:
- Команда — метод объекта `commands`
- Получает массив `args` (разделённые пробелами слова после имени команды)
- Возвращает строку (синхронно) или Promise&lt;string&gt; (асинхронно)
- Ошибки обрабатываются автоматически через try/catch в `handleKeyDown`

### Темы

Файл `src/themes.js` содержит массив тем. Каждая тема:

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

Добавить новую тему — просто допишите объект в массив. Команда `theme ls` покажет все имена.

### Список задач (todo)

Данные хранятся в localStorage под ключом `terminal-todos`. Формат:

```json
{
  "todos": [
    {
      "id": 1,
      "text": "Купить молоко",
      "completed": false,
      "createdAt": "2025-07-17T12:00:00.000Z",
      "completedAt": null
    }
  ],
  "nextId": 2
}
```

Очистка localStorage сбросит все задачи.

### Шрифт

Шрифт Cascadia Code лежит в `fonts/CascadiaCode.ttf`. Чтобы заменить:

1. Положите новый `.ttf` файл в `fonts/`
2. В `src/app.css` в блоке `@font-face` измените `src: url('fonts/Название.ttf')` и `font-family`

### CSS-стили

Все стили в `src/app.css`. Основные классы:

| Класс              | Назначение                     |
|--------------------|---------------------------------|
| `.navbar`          | Верхняя панель навигации        |
| `.site-content`    | Основной контейнер контента     |
| `.hero`            | Заголовочная секция             |
| `.card`            | Карточка (about)                |
| `.skills-grid`     | Сетка навыков                   |
| `.projects-grid`   | Сетка проектов                  |
| `.terminal-frame`  | Рамка терминала                 |
| `.terminal-main`   | Внутренняя область терминала    |
| `.terminal-history`| История команд в терминале      |
| `.terminal-input`  | Поле ввода команд               |
| `.social-links`    | Социальные ссылки               |
| `.footer`          | Нижний колонтитул               |

Цвета подставляются через CSS-переменные `--terminal-bg`, `--terminal-fg` и т.д. — они динамически меняются при смене темы.

---

## Развёртывание

Любой статический HTTP-сервер:

```bash
# через npx
npx serve .

# через Python
python -m http.server 3000

# через VS Code Live Server
# установите расширение Live Server → ПКМ на index.html → Open with Live Server
```

Для GitHub Pages: просто включите его в настройках репозитория (ветка `main`, корень `/`).

---

## Лицензия

MIT License. Copyright (c) 2024 m0h49.
Основано на [terminal](https://github.com/m4tt72/terminal) от Yassine Fathi.
