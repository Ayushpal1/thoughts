import { Point } from "../domain/point";

export class Camera {
  constructor() {
    this.offsetX = 0
    this.offsetY = 0
    this.zoom = 1
  }

  worldToScreen(p) {
    return new Point(
      (p.x + this.offsetX) * this.zoom,
      (p.y + this.offsetY) * this.zoom
    )
  }

  screenToWorld(p) {
    return new Point(
      p.x / this.zoom - this.offsetX,
      p.y / this.zoom - this.offsetY
    )
  }
}
