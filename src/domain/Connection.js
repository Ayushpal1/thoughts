export class Connection {
    constructor(
        id,
        sourceId,
        targetId
    ) {
        this.id = id;
        this.sourceId = sourceId;
        this.targetId = targetId;
    }

    draw(
        ctx,
        camera,
        sourceNode,
        targetNode
    ) {
        if (!sourceNode || !targetNode)
            return;

        const start =
            camera.worldToScreen(sourceNode);

        const end =
            camera.worldToScreen(targetNode);

        ctx.save();

        ctx.beginPath();

        ctx.setLineDash([6, 6]);

        ctx.strokeStyle = "#666";

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        ctx.stroke();

        ctx.restore();
    }
}