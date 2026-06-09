import { Camera } from "./Camera.js";
import { GridRenderer } from "./GridRenderer.js";

import { WordNode } from "../domain/WordNode.js";
import { Connection } from "../domain/Connection.js";
import { InteractionMode } from "../domain/InteractionMode.js";

import { GroupRenderer } from "../renderers/GroupRenderer.js";

import { StorageManager } from "../storage/StorageManager.js";

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

        this.connectionSource = null;

        this.connectionPreview = null;
        this.interactionMode = InteractionMode.IDLE;

        this.groupRenderer = new GroupRenderer();

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

    addNode(text, tags, x = 0, y = 0) {
        const node = new WordNode(crypto.randomUUID(), text, tags, x, y);

        this.nodes.push(node);

        this.save();

        console.log(this.getGroups());

        return node;
    }

    updateNode(id, text, tags) {
        const node = this.nodes.find(n => n.id === id);

        if (!node) return;

        node.text = text;
        node.tags = tags;

        console.log(this.getGroups());

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
        const exists =
            this.connections.some(
                c =>
                    (
                        c.sourceId ===
                        sourceId &&
                        c.targetId ===
                        targetId
                    )
                    ||
                    (
                        c.sourceId ===
                        targetId &&
                        c.targetId ===
                        sourceId
                    )
            );

        if (exists) {
            return;
        }

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

    getGroups() {
        const groups = new Map();

        for (const node of this.nodes) {
            const tags = node.tags?.length ? node.tags : ["untagged"];

            for (const tag of tags) {
                if (!groups.has(tag)) {
                    groups.set(tag,[]);
                }

                groups.get(tag).push(node);
            }
        }

        return groups;
    }

    save() {
        StorageManager.save(this);
    }

    load() {

        const data =
            StorageManager.load();

        this.nodes =
            data.nodes.map(
                n => new WordNode(
                    n.id,
                    n.text,
                    n.tags || [],
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

        if (this.previewShape) {
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

        this.groupRenderer.draw(ctx, this.camera, this.getGroups());

        if (this.connectionPreview) {

            this.connectionPreview.draw(
                ctx,
                this.camera
            );
        }
    }
}