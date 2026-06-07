import { TodoStorage }
from "../storage/TodoStorage.js";

export class TodoPanel {

    constructor() {

        this.todos = TodoStorage.load();

        this.isCollapsed = false;

        this.root = document.getElementById("todoPanel");

        this.toggleBtn = document.getElementById("todoToggle");

        this.list = document.getElementById("todoList");

        this.input = document.getElementById("todoInput");

        this.addBtn = document.getElementById("todoAddBtn");

        this.toggleBtn.addEventListener("click",() => this.toggle());

        this.addBtn.addEventListener("click",() => this.addTodo());

        this.render();
    }

    toggle() {

        this.isCollapsed = !this.isCollapsed;

        const body = document.getElementById("todoBody");

        body.style.display = this.isCollapsed ? "none" : "flex";

        this.toggleBtn.textContent = this.isCollapsed ? "▶ TODO" : "▼ TODO";
    }

    addTodo() {

        const text = this.input.value.trim();

        if (!text) {
            return;
        }

        this.todos.push({
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: Date.now()
        });

        this.input.value = "";

        this.save();
    }

    toggleTodo(id) {

        const todo = this.todos.find(t => t.id === id);

        if (!todo) {
            return;
        }

        todo.completed = !todo.completed;

        this.save();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);

        this.save();
    }

    save() {
        TodoStorage.save(this.todos);

        this.render();
    }

    render() {

        this.list.innerHTML = "";

        for (const todo of this.todos) {

            const row = document.createElement("div");

            row.className = "todo-row";

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.checked = todo.completed;

            checkbox.addEventListener("change", () => this.toggleTodo(todo.id));

            const text = document.createElement("span");

            text.textContent = todo.text;

            if (todo.completed) {
                text.classList.add("todo-completed");
            }

            const deleteBtn = document.createElement("button");

            deleteBtn.textContent = "✕";

            deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id));

            row.appendChild(checkbox);

            row.appendChild(text);

            row.appendChild(deleteBtn);

            this.list.appendChild(row);
        }
    }
}