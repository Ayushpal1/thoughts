import { Camera } from "./Camera.js";
import { GridRenderer } from "./GridRenderer.js";

export class CanvasEngine {
    constructor(ctx) {
        this.ctx = ctx;
        this.camera = new Camera();
        this.grid = new GridRenderer();

        this.shapes = [];

        // NEW
        this.previewShape = null;

        this.activeTool = null;
    }

    setTool(tool) {
        this.activeTool = tool;
    }

    addShape(shape) {
        this.shapes.push(shape);
    }

    setPreviewShape(shape) {
        this.previewShape = shape;
    }

    clearPreviewShape() {
        this.previewShape = null;
    }

    render() {
        const ctx = this.ctx;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.grid.draw(ctx, this.camera);

        // Permanent shapes
        for (const shape of this.shapes) {
            shape.draw(ctx, this.camera);
        }

        // Shape currently being drawn
        if (this.previewShape) {
            this.previewShape.draw(ctx, this.camera);
        }
    }
}