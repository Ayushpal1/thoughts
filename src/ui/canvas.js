import { Point } from "../domain/point";

export function attachCanvasEvents(canvas, engine) {
  const getPoint = e => new Point(e.offsetX, e.offsetY)

  let isDrawing = false;

canvas.addEventListener("pointerdown", e => {
    isDrawing = true;

    engine.activeTool?.onPointerDown(
        engine.camera.screenToWorld(getPoint(e))
    );
});

canvas.addEventListener("pointermove", e => {
    if (!isDrawing) return;

    engine.activeTool?.onPointerMove(
        engine.camera.screenToWorld(getPoint(e))
    );
});

canvas.addEventListener("pointerup", e => {
    isDrawing = false;

    engine.activeTool?.onPointerUp(
        engine.camera.screenToWorld(getPoint(e))
    );
});

  canvas.addEventListener("wheel", e => {
    e.preventDefault()
    engine.camera.zoom *= e.deltaY < 0 ? 1.1 : 0.9
  })
}

export class ConnectionCreationStrategy {
    handlePointerDown(node) {}
    handlePointerMove(node) {}
    handlePointerUp(node) {}
}