# a11ytesting02

A small, dependency-free **accessible TODO application** built with plain HTML,
CSS, and vanilla JavaScript. It is intended as a simple, reviewable example for
accessibility (a11y) testing.

## Features

- Add a task
- Mark a task complete or incomplete
- Delete a task
- Tasks persist across page reloads via `localStorage`

## Accessibility highlights

- Semantic HTML landmarks (`header`, `main`, `section`) with headings
- A "Skip to main content" link for keyboard users
- Form input with a properly associated `<label>` and a description hint
- Validation errors surfaced via `role="alert"` and `aria-invalid`
- An `aria-live` status region that announces added, completed, and deleted tasks
- Fully keyboard operable: every control is reachable and usable with the keyboard
- Visible focus indicators via `:focus-visible`
- Icon-only delete button with a visually hidden accessible name

## How to run

No build step, package manager, or server is required. Just open the app in a
web browser:

```
open index.html
```

Or double-click `index.html` in your file manager.

## Files

- `index.html` — markup and the task item `<template>`
- `styles.css` — styling, focus states, and the visually-hidden utility
- `app.js` — task logic, rendering, and `localStorage` persistence
