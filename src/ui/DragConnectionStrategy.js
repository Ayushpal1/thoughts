import { ConnectionCreationStrategy } from "./canvas";

export class DragConnectionStrategy
    extends ConnectionCreationStrategy {

    constructor(engine) {
        super();
        this.engine = engine;
        this.source = null;
    }

    handlePointerDown(node) {
        this.source = node;
    }

    handlePointerUp(target) {
        if (
            this.source &&
            target &&
            this.source !== target
        ) {
            this.engine.addConnection(
                this.source.id,
                target.id
            );
        }

        this.source = null;
    }
}