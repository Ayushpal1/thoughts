import { Tool } from "./Tool.js";
import { Stroke } from "../domain/Stroke.js";

export class PenTool extends Tool {
    constructor(engine, getColor) {
        super();

        this.engine = engine;
        this.getColor = getColor;

        this.points = [];
    }

    onPointerDown(point) {
        this.points = [point];
    }

    onPointerMove(point) {
        this.points.push(point);

        const previewStroke = new Stroke(
            [...this.points],
            this.getColor()
        );

        this.engine.setPreviewShape(previewStroke);
    }

    onPointerUp(point) {
        this.points.push(point);

        const finalStroke = new Stroke(
            [...this.points],
            this.getColor()
        );

        this.engine.addShape(finalStroke);

        this.engine.clearPreviewShape();

        this.points = [];
    }
}