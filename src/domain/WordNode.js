import { Drawable } from "./Drawable.js";

export class WordNode extends Drawable {
    constructor(
        id,
        text,
        tags,
        x,
        y
    ) {
        super();

        this.id = id;
        this.text = text;
        this.tags = tags;

        this.x = x;
        this.y = y;

        this.rx = 60;
        this.ry = 25;
    }

    containsPoint(point) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;

        return (
            (dx * dx) / (this.rx * this.rx) +
            (dy * dy) / (this.ry * this.ry)
        ) <= 1;
    }

    draw(ctx, camera, selected = false) {
        const screen =
            camera.worldToScreen({
                x: this.x,
                y: this.y
            });

        ctx.save();

        ctx.beginPath();

        ctx.ellipse(
            screen.x,
            screen.y,
            this.rx * camera.zoom,
            this.ry * camera.zoom,
            0,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "white";

        ctx.strokeStyle =
            selected ? "#2196f3" : "#333";

        ctx.lineWidth =
            selected ? 3 : 2;

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            this.text,
            screen.x,
            screen.y
        );

        ctx.restore();
    }
}