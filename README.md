# a11ytesting02

A simple, accessible TODO application built with semantic HTML, CSS, and
vanilla JavaScript. No frameworks, build tooling, or package managers required.

## Features

- Add a task
- Mark a task complete or incomplete
- Delete a task
- Tasks persist across page reloads using `localStorage`

## Accessibility

The UI is built with accessibility in mind:

- Semantic HTML landmarks and headings
- A "skip to main content" link
- Labelled form input with descriptive help text
- Keyboard operable controls with visible focus states
- An `aria-live` status region that announces list changes
- Color contrast meeting WCAG AA

## Running the app

No build step is needed. Open `index.html` directly in any modern browser:

```sh
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

## Project structure

- `index.html` – markup and page structure
- `styles.css` – styling, focus states, and contrast-aware colors
- `app.js` – application logic and `localStorage` persistence
