(function () {
  "use strict";

  var STORAGE_KEY = "a11y-todo-items";

  var form = document.getElementById("todo-form");
  var input = document.getElementById("task-input");
  var inputError = document.getElementById("task-input-error");
  var list = document.getElementById("todo-list");
  var emptyState = document.getElementById("empty-state");
  var status = document.getElementById("status");
  var template = document.getElementById("todo-item-template");

  /** @type {Array<{id: string, text: string, done: boolean}>} */
  var tasks = [];

  // --- Persistence -----------------------------------------------------

  function loadTasks() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(function (item) {
        return item && typeof item.id === "string" && typeof item.text === "string";
      }).map(function (item) {
        return { id: item.id, text: item.text, done: Boolean(item.done) };
      });
    } catch (err) {
      return [];
    }
  }

  function saveTasks() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      // Storage may be unavailable (e.g. private mode); fail silently.
    }
  }

  // --- Helpers ---------------------------------------------------------

  function makeId() {
    return "task-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function announce(message) {
    status.textContent = message;
  }

  function updateEmptyState() {
    emptyState.hidden = tasks.length > 0;
  }

  // --- Rendering -------------------------------------------------------

  function renderTask(task) {
    var fragment = template.content.cloneNode(true);
    var li = fragment.querySelector(".todo-item");
    var checkbox = fragment.querySelector(".todo-checkbox");
    var label = fragment.querySelector(".todo-label");
    var deleteBtn = fragment.querySelector(".btn-delete");
    var deleteBtnLabel = deleteBtn.querySelector(".visually-hidden");

    li.dataset.id = task.id;
    li.classList.toggle("is-complete", task.done);

    checkbox.checked = task.done;
    checkbox.id = task.id;
    label.setAttribute("for", task.id);
    label.textContent = task.text;

    deleteBtnLabel.textContent = "Delete task: " + task.text;

    checkbox.addEventListener("change", function () {
      toggleTask(task.id, checkbox.checked);
    });

    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    list.appendChild(fragment);
  }

  function render() {
    list.textContent = "";
    tasks.forEach(renderTask);
    updateEmptyState();
  }

  // --- Actions ---------------------------------------------------------

  function addTask(text) {
    var task = { id: makeId(), text: text, done: false };
    tasks.push(task);
    saveTasks();
    renderTask(task);
    updateEmptyState();
    announce('Added task: "' + text + '".');
  }

  function toggleTask(id, done) {
    var task = tasks.find(function (item) {
      return item.id === id;
    });
    if (!task) {
      return;
    }
    task.done = done;
    saveTasks();

    var li = list.querySelector('[data-id="' + id + '"]');
    if (li) {
      li.classList.toggle("is-complete", done);
    }
    announce(
      done
        ? 'Marked complete: "' + task.text + '".'
        : 'Marked incomplete: "' + task.text + '".'
    );
  }

  function deleteTask(id) {
    var index = tasks.findIndex(function (item) {
      return item.id === id;
    });
    if (index === -1) {
      return;
    }
    var removed = tasks.splice(index, 1)[0];
    saveTasks();

    var li = list.querySelector('[data-id="' + id + '"]');
    if (li) {
      li.parentNode.removeChild(li);
    }
    updateEmptyState();
    announce('Deleted task: "' + removed.text + '".');

    // Move focus to a sensible place after deletion.
    input.focus();
  }

  // --- Events ----------------------------------------------------------

  function showError() {
    inputError.hidden = false;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", "task-input-hint task-input-error");
  }

  function clearError() {
    inputError.hidden = true;
    input.removeAttribute("aria-invalid");
    input.setAttribute("aria-describedby", "task-input-hint");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();
    if (!text) {
      showError();
      input.focus();
      return;
    }
    clearError();
    addTask(text);
    input.value = "";
    input.focus();
  });

  input.addEventListener("input", function () {
    if (!inputError.hidden && input.value.trim()) {
      clearError();
    }
  });

  // --- Init ------------------------------------------------------------

  tasks = loadTasks();
  render();
})();
