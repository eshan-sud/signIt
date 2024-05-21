window.addEventListener("load", () => {
    resize();
    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousemove", sketch);
    window.addEventListener("resize", resize);
    document.getElementById("toolbar-settings").addEventListener("change", updateToolbarSettings);
    document.getElementById("background-check").addEventListener("click", changeBackgroundTransparency);
});
// Drawing Board
const drawingBoard = document.getElementById("drawing-board");
const context = drawingBoard.getContext("2d");
let strokeWidth = 5, strokeColor = "black";
let coords = { x: 0, y: 0 };
let paint = false;
// Update Toolbar Settings
function updateToolbarSettings() {
    strokeWidth = document.getElementById("stroke-width").value;
    strokeColor = document.getElementById("stroke-color").value;
    if (!document.getElementById("background-check").checked) {
        let color = document.getElementById("background-color").value;
        context.save();
        context.fillStyle = color;
        context.fillRect(0, 0, drawingBoard.width, drawingBoard.height);
        context.restore();
    }
    else {clearCanvas();}
}
// Clears the Canvas
function clearCanvas() {context.clearRect(0, 0, drawingBoard.width, drawingBoard.height);}
// Saves the Canvas
function save() {
    const documentSelection = document.getElementById("download-options").value;
    const selection = {
        "png": "image/png",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "pdf": "application/pdf"
    };
    const dataURL = drawingBoard.toDataURL(selection[documentSelection]);
    let downloadButton = document.getElementById("download-button").querySelector("a");
    downloadButton.href = dataURL;
    downloadButton.download = "signature." + documentSelection;
}
// Background Color Settings
function changeBackgroundTransparency() {
    const backgroundRow = document.getElementById("background-color-row");
    backgroundRow.style.visibility = backgroundRow.style.visibility === "hidden" ? "visible" : "hidden";
    updateToolbarSettings();
}
// Resizes the Canvas
function resize() {
    context.canvas.width = 750;
    context.canvas.height = 250;
    updateToolbarSettings();
}
// Gets the position of the Cursor
function getPosition(event) {
    const rect = drawingBoard.getBoundingClientRect();
    const scaleX = drawingBoard.width / rect.width;
    const scaleY = drawingBoard.height / rect.height;
    coords.x = (event.clientX - rect.left) * scaleX;
    coords.y = (event.clientY - rect.top) * scaleY;
}
// Starts Painting
function startPainting(event) {
    paint = true;
    getPosition(event);
}
// Stops Painting
function stopPainting() {paint = false;}
// Sketchs the Drawing
function sketch(event) {
    if (!paint) return;
    context.beginPath();
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.lineCap = "round";
    context.moveTo(coords.x, coords.y);
    getPosition(event);
    context.lineTo(coords.x, coords.y);
    context.stroke();
}