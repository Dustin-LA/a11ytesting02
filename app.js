(function () {
  "use strict";

  var STORAGE_KEY = "a11y-todos";

  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  var list = document.getElementById("todo-list");
  var emptyState = document.getElementById("empty-state");
  var status = document.getElementById("status");

  var todos = load();

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      /* storage may be unavailable; app still works in-memory */
    }
  }

  function announce(message) {
    status.textContent = message;
  }

  function render() {
    list.innerHTML = "";

    emptyState.hidden = todos.length > 0;

    todos.forEach(function (todo) {
      var item = document.createElement("li");
      item.className = "todo-item" + (todo.done ? " is-done" : "");

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;
      checkbox.id = "todo-" + todo.id;
      checkbox.addEventListener("change", function () {
        toggle(todo.id);
      });

      var label = document.createElement("label");
      label.className = "todo-item__label";
      label.setAttribute("for", checkbox.id);
      label.textContent = todo.text;

      var del = document.createElement("button");
      del.type = "button";
      del.className = "todo-item__delete";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete task: " + todo.text);
      del.addEventListener("click", function () {
        remove(todo.id);
      });

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(del);
      list.appendChild(item);
    });
  }

  function add(text) {
    var trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    todos.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      text: trimmed,
      done: false
    });
    save();
    render();
    announce("Added task: " + trimmed);
  }

  function toggle(id) {
    todos = todos.map(function (todo) {
      if (todo.id === id) {
        todo.done = !todo.done;
        announce(
          (todo.done ? "Completed task: " : "Marked active: ") + todo.text
        );
      }
      return todo;
    });
    save();
    render();
  }

  function remove(id) {
    var removed = todos.find(function (todo) {
      return todo.id === id;
    });
    todos = todos.filter(function (todo) {
      return todo.id !== id;
    });
    save();
    render();
    if (removed) {
      announce("Deleted task: " + removed.text);
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    add(input.value);
    input.value = "";
    input.focus();
  });

  render();

  // Expose for potential testing/debugging.
  window.__todoApp = { add: add, toggle: toggle, remove: remove, getTodos: function () { return todos; } };
})();
