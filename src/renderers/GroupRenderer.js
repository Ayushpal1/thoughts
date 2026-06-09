export class GroupRenderer {

    draw(ctx, camera, groups) {

        ctx.save();

        for (const [tag, nodes] of groups) {

            if (nodes.length === 0) continue;

            let minX = Infinity;
            let minY = Infinity;

            let maxX = -Infinity;
            let maxY = -Infinity;

            for (const node of nodes) {
                minX = Math.min(minX, node.x - node.rx);

                minY = Math.min(minY, node.y - node.ry);

                maxX = Math.max(maxX, node.x + node.rx);

                maxY = Math.max(maxY, node.y + node.ry);
            }

            const padding = 40;

            minX -= padding;
            minY -= padding;

            maxX += padding;
            maxY += padding;

            const topLeft = camera.worldToScreen({ x: minX, y: minY });

            const bottomRight = camera.worldToScreen({ x: maxX, y: maxY });

            const width = bottomRight.x - topLeft.x;

            const height = bottomRight.y - topLeft.y;

            ctx.beginPath();

            ctx.roundRect(topLeft.x, topLeft.y, width, height, 25);

            ctx.fillStyle = "rgba(33,150,243,0.05)";

            ctx.strokeStyle = "rgba(33,150,243,0.5)";

            ctx.lineWidth = 2;

            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#1565c0";

            ctx.font = "bold 18px sans-serif";

            ctx.fillText(tag, topLeft.x + 15, topLeft.y - 10);
        }

        ctx.restore();
    }

}