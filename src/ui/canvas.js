import { Point } from "../domain/point";

export function attachCanvasEvents(canvas, engine) {
  // const getPoint = e => new Point(e.offsetX, e.offsetY)

  function getCanvasPoint(e) {

    const rect =
        canvas.getBoundingClientRect();

    return new Point(
        e.clientX - rect.left,
        e.clientY - rect.top
    );
}

  let isDrawing = false;

  canvas.addEventListener("pointerdown", e => {

    canvas.setPointerCapture(
    e.pointerId
);
    isDrawing = true;

    const worldPoint =
      engine.camera.screenToWorld(
        getCanvasPoint(e)
      );

    const node =
      engine.findNodeAt(
        worldPoint
      );
    engine.selectedNode = node;

    if (node) {

      engine.draggingNode = node;

      engine.dragOffsetX =
        worldPoint.x - node.x;

      engine.dragOffsetY =
        worldPoint.y - node.y;
    }

    if (!node) {
      engine.activeTool?.onPointerDown(
        worldPoint
      );
    }
  });

  window.addEventListener("pointermove", e => {
    const screenPoint =
    getCanvasPoint(e);

const worldPoint =
    engine.camera.screenToWorld(
        screenPoint
    );

    if (engine.draggingNode) {

      engine.draggingNode.x =
        worldPoint.x -
        engine.dragOffsetX;

      engine.draggingNode.y =
        worldPoint.y -
        engine.dragOffsetY;

      engine.save();

      return;
    }
    if (!isDrawing) return;

    if (!engine.draggingNode) {
      engine.activeTool?.onPointerMove(
        worldPoint
      );
    }
  });

  window.addEventListener("pointerup", e => {

    const screenPoint =
        getCanvasPoint(e);

    const worldPoint =
        engine.camera.screenToWorld(
            screenPoint
        );

    const wasDragging =
        !!engine.draggingNode;

    engine.draggingNode = null;

    isDrawing = false;

    canvas.releasePointerCapture(
        e.pointerId
    );

    if (!wasDragging) {

        engine.activeTool?.onPointerUp(
            worldPoint
        );
    }
});

  canvas.addEventListener("wheel", e => {
    e.preventDefault()
    engine.camera.zoom *= e.deltaY < 0 ? 1.1 : 0.9
  })
}

export class ConnectionCreationStrategy {
  handlePointerDown(node) { }
  handlePointerMove(node) { }
  handlePointerUp(node) { }
}