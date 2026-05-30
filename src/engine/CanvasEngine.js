import { Camera } from "./Camera.js";
import { GridRenderer } from "./GridRenderer.js";

import { WordNode } from "../domain/WordNode.js";
import { Connection } from "../domain/Connection.js";

import { StorageManager }
from "../storage/StorageManager.js";

export class CanvasEngine {

    constructor(ctx) {

        this.ctx = ctx;

        this.camera = new Camera();

        this.grid =
            new GridRenderer();

        this.shapes = [];

        this.previewShape = null;

        this.activeTool = null;

        this.nodes = [];

        this.connections = [];

        this.selectedNode = null;
        this.draggingNode = null;
this.dragOffsetX = 0;
this.dragOffsetY = 0;

        this.load();
    }

    setTool(tool) {
        this.activeTool = tool;
    }

    // addShape(shape) {
        // this.shapes.push(shape);
    // }
    addShape(shape) {

    console.log(
        "Shapes:",
        this.shapes.length + 1
    );

    this.shapes.push(shape);
}

    setPreviewShape(shape) {
        this.previewShape = shape;
    }

    clearPreviewShape() {
        this.previewShape = null;
    }

    addNode(
        text,
        tag,
        x = 0,
        y = 0
    ) {
        const node =
            new WordNode(
                crypto.randomUUID(),
                text,
                tag,
                x,
                y
            );

        this.nodes.push(node);

        this.save();

        return node;
    }

    updateNode(
        id,
        text,
        tag
    ) {
        const node =
            this.nodes.find(
                n => n.id === id
            );

        if (!node) return;

        node.text = text;
        node.tag = tag;

        this.save();
    }

    deleteNode(id) {

        this.nodes =
            this.nodes.filter(
                n => n.id !== id
            );

        this.connections =
            this.connections.filter(
                c =>
                    c.sourceId !== id &&
                    c.targetId !== id
            );

        if (
            this.selectedNode?.id === id
        ) {
            this.selectedNode = null;
        }

        this.save();
    }

    addConnection(
        sourceId,
        targetId
    ) {
        this.connections.push(
            new Connection(
                crypto.randomUUID(),
                sourceId,
                targetId
            )
        );

        this.save();
    }

    getNodeById(id) {
        return this.nodes.find(
            n => n.id === id
        );
    }

    findNodeAt(point) {
        return this.nodes.find(
            node =>
                node.containsPoint(point)
        );
    }

    save() {
        StorageManager.save(this);
    }

    load() {

        const data =
            StorageManager.load();

        this.nodes =
            data.nodes.map(
                n =>
                    new WordNode(
                        n.id,
                        n.text,
                        n.tag,
                        n.x,
                        n.y
                    )
            );

        this.connections =
            data.connections.map(
                c =>
                    new Connection(
                        c.id,
                        c.sourceId,
                        c.targetId
                    )
            );
    }

    render() {

        const ctx = this.ctx;

        ctx.clearRect(
            0,
            0,
            ctx.canvas.width,
            ctx.canvas.height
        );

        this.grid.draw(
            ctx,
            this.camera
        );

        for (
            const connection
            of this.connections
        ) {

            connection.draw(
                ctx,
                this.camera,
                this.getNodeById(
                    connection.sourceId
                ),
                this.getNodeById(
                    connection.targetId
                )
            );
        }

        for (
            const shape
            of this.shapes
        ) {
            shape.draw(
                ctx,
                this.camera
            );
        }

        if (
            this.previewShape
        ) {
            this.previewShape.draw(
                ctx,
                this.camera
            );
        }

        for (
            const node
            of this.nodes
        ) {
            node.draw(
                ctx,
                this.camera,
                this.selectedNode?.id ===
                node.id
            );
        }
    }
}