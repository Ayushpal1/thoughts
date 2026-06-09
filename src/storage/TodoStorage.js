export class TodoStorage {

    static KEY = "knowledge-canvas-todos";

    static load() {
        const raw = localStorage.getItem(this.KEY);

        if (!raw) {
            return [];
        }

        return JSON.parse(raw);
    }

    static save(todos) {
        localStorage.setItem(
            this.KEY,
            JSON.stringify(todos)
        );
    }
}