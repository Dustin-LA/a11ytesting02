# a11ytesting02

A simple, accessible TODO application built with plain HTML, CSS, and JavaScript. No build step and no dependencies.

## Features

- Add tasks
- Mark tasks complete / active
- Delete tasks
- Tasks persist in the browser via `localStorage`
- Accessibility-minded: semantic HTML, labelled form controls, keyboard support, and a live-region status announcer

## How to run

Because the app is a static page, just open `index.html` in a web browser:

```sh
# macOS
open index.html

# Linux
xdg-open index.html
```

Or serve it locally with any static file server, for example:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — markup and page structure
- `styles.css` — styling
- `app.js` — application logic (add, toggle, delete, persistence)
