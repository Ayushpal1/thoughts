import { Drawable } from "./drawable";

export class Stroke extends Drawable {
    constructor(points, color = "black", width = 2) {
        super();
        this.points = points;
        this.color = color;
        this.width = width;
    }

    draw(ctx, camera) {
        // mandatory valid point check.
        if (this.points.length < 2) return;

        ctx.save();  // where are these methods defined?

        ctx.strokeStyle = this.color
        ctx.lineWidth = this.width
        ctx.lineCap = "round"

        ctx.beginPath();
        const start = camera.worldToScreen(this.points[0]);
        ctx.moveTo(start.x, start.y)

        for (const p of this.points) {
            const s = camera.worldToScreen(p)
            ctx.lineTo(s.x, s.y)
        }

        ctx.stroke()

        ctx.restore(); // where are these methods defined?
    }

}