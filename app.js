(function () {
  "use strict";

  var STORAGE_KEY = "a11y-todos";

  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  var list = document.getElementById("todo-list");
  var statusEl = document.getElementById("todo-status");
  var emptyMessage = document.getElementById("empty-message");

  /** @type {{ id: string, text: string, done: boolean }[]} */
  var todos = loadTodos();

  function loadTodos() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveTodos() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      /* Storage may be unavailable (e.g. private mode); fail silently. */
    }
  }

  function createId() {
    return "todo-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
  }

  function announce(message) {
    statusEl.textContent = message;
  }

  function render() {
    list.innerHTML = "";

    emptyMessage.hidden = todos.length > 0;

    todos.forEach(function (todo) {
      var item = document.createElement("li");
      item.className = "todo-item" + (todo.done ? " todo-item--done" : "");
      item.dataset.id = todo.id;

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "todo-item__checkbox";
      checkbox.checked = todo.done;
      checkbox.id = todo.id;

      var label = document.createElement("label");
      label.className = "todo-item__label";
      label.setAttribute("for", todo.id);
      label.textContent = todo.text;

      var deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "todo-item__delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute(
        "aria-label",
        "Delete task: " + todo.text
      );

      item.appendChild(checkbox);
      item.appendChild(label);
      item.appendChild(deleteBtn);
      list.appendChild(item);
    });
  }

  function addTodo(text) {
    var trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    todos.push({ id: createId(), text: trimmed, done: false });
    saveTodos();
    render();
    announce('Added task: "' + trimmed + '".');
  }

  function toggleTodo(id) {
    var todo = todos.find(function (t) {
      return t.id === id;
    });
    if (!todo) {
      return;
    }
    todo.done = !todo.done;
    saveTodos();
    render();
    announce(
      'Task "' + todo.text + '" marked ' + (todo.done ? "complete" : "incomplete") + "."
    );
  }

  function deleteTodo(id) {
    var index = todos.findIndex(function (t) {
      return t.id === id;
    });
    if (index === -1) {
      return;
    }
    var removed = todos.splice(index, 1)[0];
    saveTodos();
    render();
    announce('Deleted task: "' + removed.text + '".');
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo(input.value);
    input.value = "";
    input.focus();
  });

  list.addEventListener("change", function (event) {
    var target = event.target;
    if (target && target.classList.contains("todo-item__checkbox")) {
      var item = target.closest(".todo-item");
      if (item) {
        toggleTodo(item.dataset.id);
      }
    }
  });

  list.addEventListener("click", function (event) {
    var target = event.target;
    if (target && target.classList.contains("todo-item__delete")) {
      var item = target.closest(".todo-item");
      if (item) {
        deleteTodo(item.dataset.id);
      }
    }
  });

  render();
})();
