import { CanvasEngine } from "./engine/CanvasEngine.js"
import { attachCanvasEvents } from "./ui/canvas.js"
import { PenTool } from "./tools/PenTool.js"
import { PanTool } from "./tools/PanTool.js"
import { NodeModal } from "./ui/NodeModal.js";
import { TodoPanel } from "./ui/TodoPanel.js";
import './style.css';

// console.log("main.js loaded");
// console.log("DOM ready?", document.getElementById("colorPicker"));


const canvas = document.getElementById("canvas")
// canvas.width = window.innerWidth
// canvas.height = window.innerHeight

resizeCanvas();

const ctx = canvas.getContext("2d")
const engine = new CanvasEngine(ctx)
const nodeModal = new NodeModal(engine);
const todoPanel = new TodoPanel();

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

const addWordBtn =
    document.getElementById(
        "addWordBtn"
    );

addWordBtn.addEventListener("click",
    () => nodeModal.open()
);
const nodeActions =
    document.getElementById(
        "nodeActions"
    );

const editBtn =
    document.getElementById(
        "editNodeBtn"
    );

const deleteBtn =
    document.getElementById(
        "deleteNodeBtn"
    );

editBtn.addEventListener("click",
    () => {

        if (
            !engine.selectedNode
        ) return;

        nodeModal.open(
            engine.selectedNode
        );
    }
);

deleteBtn.addEventListener(
    "click",
    () => {

        if (
            !engine.selectedNode
        ) return;

        engine.deleteNode(
            engine.selectedNode.id
        );

        nodeActions.style.display =
            "none";
    }
);

function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;
}

window.addEventListener(
    "resize",
    resizeCanvas
);

function loop() {
  nodeActions.style.display =
    engine.selectedNode
        ? "flex"
        : "none";
  engine.render()
  requestAnimationFrame(loop)
}

loop()
