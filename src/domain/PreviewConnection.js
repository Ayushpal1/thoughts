export class PreviewConnection {

    constructor(
        x1,
        y1,
        x2,
        y2
    ) {
        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;
    }

    draw(ctx, camera) {

        const start =
            camera.worldToScreen({
                x: this.x1,
                y: this.y1
            });

        const end =
            camera.worldToScreen({
                x: this.x2,
                y: this.y2
            });

        ctx.save();

        ctx.beginPath();

        ctx.setLineDash([8, 8]);

        ctx.strokeStyle =
            "#2196f3";

        ctx.lineWidth = 2;

        ctx.moveTo(
            start.x,
            start.y
        );

        ctx.lineTo(
            end.x,
            end.y
        );

        ctx.stroke();

        ctx.restore();
    }
}