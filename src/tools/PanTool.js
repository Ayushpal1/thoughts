import { Tool } from "./Tool.js"

export class PanTool extends Tool {
  constructor(camera) {
    super()
    this.camera = camera
    this.last = null
  }

  onPointerDown(p) {
    this.last = p
  }

  onPointerMove(p) {
    if (!this.last) return
    this.camera.offsetX += (p.x - this.last.x) / this.camera.zoom
    this.camera.offsetY += (p.y - this.last.y) / this.camera.zoom
    this.last = p
  }

  onPointerUp() {
    this.last = null
  }
}
