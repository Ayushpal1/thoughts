export class NodeModal {

    constructor(engine) {

        this.engine = engine;

        this.modal =
            document.getElementById(
                "wordModal"
            );

        this.wordInput =
            document.getElementById(
                "wordInput"
            );

        this.tagInput =
            document.getElementById(
                "tagInput"
            );

        this.editingNode = null;

        document
            .getElementById(
                "closeModalBtn"
            )
            .addEventListener(
                "click",
                () => this.close()
            );

        document
            .getElementById(
                "saveWordBtn"
            )
            .addEventListener(
                "click",
                () => this.save()
            );
    }

 open(node = null) {

    console.log("OPEN MODAL CALLED");

    this.editingNode = node;

    this.wordInput.value =
        node?.text || "";

    this.tagInput.value =
        node?.tag || "";

    this.modal.classList.remove(
        "hidden"
    );
}

    close() {

        this.modal.classList.add(
            "hidden"
        );

        this.editingNode = null;
    }

    save() {

        const word =
            this.wordInput.value.trim();

        const tag =
            this.tagInput.value.trim();

        if (!word) return;

        if (this.editingNode) {

            this.engine.updateNode(
                this.editingNode.id,
                word,
                tag
            );

        } else {
const camera =
    this.engine.camera;

const canvas =
    this.engine.ctx.canvas;

const centerWorld =
    camera.screenToWorld({
        x: canvas.width / 2,
        y: canvas.height / 2
    });

this.engine.addNode(
    word,
    tag,
    centerWorld.x,
    centerWorld.y
);
        }

        this.close();
    }
}