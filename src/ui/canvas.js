import { Point } from "../domain/point";
import { PreviewConnection }
  from "../domain/PreviewConnection.js";

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

    if (e.button === 0) {
      isDrawing = true;
    }

    const worldPoint =
      engine.camera.screenToWorld(
        getCanvasPoint(e)
      );

    const node =
      engine.findNodeAt(
        worldPoint
      );

    if (e.button === 2) {

      isDrawing = false;

      if (node) {

        engine.connectionSource =
          node;
      }

      return;
    }
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

    if (
      engine.connectionSource
    ) {

      const source =
        engine.connectionSource;

      engine.connectionPreview =
        new PreviewConnection(
          source.x,
          source.y,
          worldPoint.x,
          worldPoint.y
        );
      console.log("connection line preview.");

      return;
    }

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

    if (!engine.draggingNode && isDrawing) {
      engine.activeTool?.onPointerMove(
        worldPoint
      );
    }
  });

  window.addEventListener("pointerup", e => {
    console.log("WINDOW POINTER UP");

    const screenPoint =
      getCanvasPoint(e);

    const worldPoint =
      engine.camera.screenToWorld(
        screenPoint
      );

    if (
      engine.connectionSource
    ) {

      const target =
        engine.findNodeAt(
          worldPoint
        );

      if (
        target &&
        target.id !==
        engine.connectionSource.id
      ) {

        engine.addConnection(
          engine.connectionSource.id,
          target.id
        );
      }

      engine.connectionSource =
        null;

      engine.connectionPreview =
        null;

      return;
    }

    const wasDragging =
      !!engine.draggingNode;

    const wasDrawing =
      isDrawing;

    engine.draggingNode = null;

    isDrawing = false;

    canvas.releasePointerCapture(
      e.pointerId
    );

    if (!wasDragging && wasDrawing) {
      engine.activeTool?.onPointerUp(
        worldPoint
      );
    }
  });

  canvas.addEventListener("wheel", e => {
    e.preventDefault()
    engine.camera.zoom *= e.deltaY < 0 ? 1.1 : 0.9
  })

  canvas.addEventListener(
    "contextmenu",
    e => e.preventDefault()
  );
}

export class ConnectionCreationStrategy {
  handlePointerDown(node) { }
  handlePointerMove(node) { }
  handlePointerUp(node) { }
}