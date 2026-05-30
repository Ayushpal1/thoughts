// Want dots / dark mode / adaptive grid?

export class GridRenderer {
  draw(ctx, camera, gridSize = 50) {
    const step = gridSize * camera.zoom
    const { width, height } = ctx.canvas

    ctx.strokeStyle = "#eaeaea"
    ctx.beginPath()

    for (let x = camera.offsetX % step; x < width; x += step) {
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
    }

    for (let y = camera.offsetY % step; y < height; y += step) {
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
    }

    ctx.stroke()
  }
}
