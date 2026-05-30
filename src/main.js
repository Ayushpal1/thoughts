import { CanvasEngine } from "./engine/CanvasEngine.js"
import { attachCanvasEvents } from "./ui/canvas.js"
import { PenTool } from "./tools/PenTool.js"
import { PanTool } from "./tools/PanTool.js"

// console.log("main.js loaded");
// console.log("DOM ready?", document.getElementById("colorPicker"));


const canvas = document.getElementById("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext("2d")
const engine = new CanvasEngine(ctx)

// this will get the currently selected color from the component.
const colorPicker = document.getElementById("colorPicker");

// we can either use this to abstract the functionality or directly pass the color.
const getColor = () => colorPicker.value;

// for now we are passing color directly else we should have passed getColor without ()
const pen = new PenTool(
    engine,
    getColor
);
const pan = new PanTool(engine.camera)

engine.setTool(pen) // switch tools anytime
attachCanvasEvents(canvas, engine)

function loop() {
  engine.render()
  requestAnimationFrame(loop)
}

loop()
