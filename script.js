window.addEventListener("load", () => {
    resize();
    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousemove", sketch);
    document.addEventListener("touchstart", startTouchPainting, { passive: false });
    document.addEventListener("touchend", stopPainting);
    document.addEventListener("touchmove", touchSketch, { passive: false });
    window.addEventListener("resize", resize);
    document.getElementById("toolbar-settings").addEventListener("change", updateToolbarSettings);
    document.getElementById("background-check").addEventListener("click", changeBackgroundTransparency);
});
// Drawing Board
const drawingBoard = document.getElementById("drawing-board");
const context = drawingBoard.getContext("2d");
let color;
let strokeWidth = 5, strokeColor = "black";
let coords = { x: 0, y: 0 };
let paint = false;
// Update the Toolbar Settings
function updateToolbarSettings() {
    strokeWidth = document.getElementById("stroke-width").value;
    strokeColor = document.getElementById("stroke-color").value;
    if (!document.getElementById("background-check").checked) {
        color = document.getElementById("background-color").value;
        context.save();
        context.fillStyle = color;
        context.fillRect(0, 0, drawingBoard.width, drawingBoard.height);
        context.restore();
    }
}
// Clears the Canvas
function clearCanvas() {
    paint = false;
    context.clearRect(0, 0, drawingBoard.width, drawingBoard.height);
    updateToolbarSettings();
}
// Saves the Canvas
// function save() {
//     const documentSelection = document.getElementById("download-options").value;
//     const selection = {
//         "png": "image/png",
//         "jpg": "image/jpg",
//         "pdf": "application/pdf"
//     };
//     const dataURL = drawingBoard.toDataURL(selection[documentSelection]);
//     let downloadButton = document.getElementById("download-button").querySelector("a");
//     downloadButton.href = dataURL;
//     downloadButton.download = "signature." + documentSelection;
// }
function save() {
    const documentSelection = document.getElementById("download-options").value;
    switch (documentSelection) {
        case "png":
        case "jpg":
            saveImage(documentSelection);
            break;
        case "pdf":
            savePDF();
            break;
        default:
            console.error("Unsupported file format selected");
    }
}
function saveImage(format) {
    const dataURL = drawingBoard.toDataURL(`image/${format}`);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `signature_${getTimestamp()}.${format}`;
    link.click();
}
const { jsPDF } = window.jspdf;
function savePDF() {
    const canvas = document.getElementById("drawing-board");
    const imgData = canvas.toDataURL("image/jpg", 1.0);
    const pdf = new jsPDF();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
    const width = canvasWidth * ratio;
    const height = canvasHeight * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    pdf.addImage(imgData, 'JPG', x, y, width, height);
    const format = "pdf";
    pdf.save(`signature_${getTimestamp()}.${format}`);
}
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}
// Background Color Settings
function changeBackgroundTransparency() {
    const backgroundRow = document.getElementById("background-color-row");
    backgroundRow.style.visibility = backgroundRow.style.visibility === "hidden" ? "visible" : "hidden";
    clearCanvas();
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
// Gets the position of the Touch
function getTouchPosition(event) {
    const rect = drawingBoard.getBoundingClientRect();
    const scaleX = drawingBoard.width / rect.width;
    const scaleY = drawingBoard.height / rect.height;
    coords.x = (event.touches[0].clientX - rect.left) * scaleX;
    coords.y = (event.touches[0].clientY - rect.top) * scaleY;
}
// Starts Painting
function startPainting(event) {
    paint = true;
    getPosition(event);
}
function startTouchPainting(event) {
    if (event.target === drawingBoard) {
        event.preventDefault();
        paint = true;
        getTouchPosition(event);
    }
}
// Stops Painting
function stopPainting() {
    paint = false;
}
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
function touchSketch(event) {
    if (!paint) return;
    if (event.target === drawingBoard) {
        event.preventDefault();
        context.beginPath();
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeWidth;
        context.lineCap = "round";
        context.moveTo(coords.x, coords.y);
        getTouchPosition(event);
        context.lineTo(coords.x, coords.y);
        context.stroke();
    }
}