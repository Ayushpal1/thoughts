export class StorageManager {
    static KEY = "knowledge-canvas";

    static save(engine) {
        const payload = {
            nodes: engine.nodes,
            connections:
                engine.connections
        };

        localStorage.setItem(
            this.KEY,
            JSON.stringify(payload)
        );
    }

    static load() {
        const raw =
            localStorage.getItem(this.KEY);

        if (!raw) {
            return {
                nodes: [],
                connections: []
            };
        }

        return JSON.parse(raw);
    }
}