import { Point } from "../domain/point";
import { PreviewConnection } from "../domain/PreviewConnection.js";
import { InteractionMode } from "../domain/InteractionMode.js";

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

  canvas.addEventListener("pointerdown", e => {

    canvas.setPointerCapture(e.pointerId);

    const worldPoint = engine.camera.screenToWorld(getCanvasPoint(e));

    const node = engine.findNodeAt(worldPoint);

    if (e.button === 2) {
      if (node) {
        engine.connectionSource = node;
        engine.interactionMode = InteractionMode.CONNECTING;
      }

      return;
    }
    engine.selectedNode = node;

    if (node) {
      engine.draggingNode = node;
      engine.dragOffsetX = worldPoint.x - node.x;
      engine.dragOffsetY = worldPoint.y - node.y;
      engine.interactionMode = InteractionMode.DRAGGING_NODE;
      return;
    }

    engine.interactionMode = InteractionMode.DRAWING;
    engine.activeTool?.onPointerDown(worldPoint);
  });

  window.addEventListener("pointermove", e => {
    const screenPoint = getCanvasPoint(e);

    const worldPoint = engine.camera.screenToWorld(screenPoint);

    switch (engine.interactionMode) {
      case InteractionMode.CONNECTING: {
        const source = engine.connectionSource;

        engine.connectionPreview =
          new PreviewConnection(
            source.x,
            source.y,
            worldPoint.x,
            worldPoint.y
          );

        return;
      }

      case InteractionMode.DRAGGING_NODE: {
        if (!engine.draggingNode) {
          return;
        }

        engine.draggingNode.x = worldPoint.x - engine.dragOffsetX;
        engine.draggingNode.y = worldPoint.y - engine.dragOffsetY;
        engine.save();

        return;
      }

      case InteractionMode.DRAWING: {
        engine.activeTool?.onPointerMove(worldPoint);
        return;
      }

      case InteractionMode.IDLE:
      default:
        return;
    }
  });

  window.addEventListener("pointerup", e => {

    const screenPoint = getCanvasPoint(e);

    const worldPoint = engine.camera.screenToWorld(screenPoint);

    const previousMode = engine.interactionMode;

    canvas.releasePointerCapture(e.pointerId);

    engine.interactionMode = InteractionMode.IDLE;

    switch (previousMode) {

      case InteractionMode.DRAWING: {
        engine.activeTool?.onPointerUp(worldPoint);
        break;
      }

      case InteractionMode.CONNECTING: {
        const target = engine.findNodeAt(worldPoint);

        if (target && target.id !== engine.connectionSource?.id) {
          engine.addConnection(engine.connectionSource.id, target.id);
        }

        engine.connectionSource = null;
        engine.connectionPreview = null;

        break;
      }

      case InteractionMode.DRAGGING_NODE: {
        engine.draggingNode = null;

        engine.save();

        break;
      }

      case InteractionMode.IDLE:
      default:
        break;

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