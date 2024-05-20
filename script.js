window.addEventListener("load", () => {
    resize();
    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousemove", sketch);
    window.addEventListener("resize", resize);
    const toolBar = document.getElementById("toolbar-settings");
    toolBar.addEventListener("change", updateToolbarSettings);
    document.getElementById("background-check").addEventListener("click", changeBackgroundTransparency);
    document.getElementById("background-color").addEventListener("change", changeBackground);
});

// Drawing Board
const drawingBoard = document.getElementById("drawing-board");
const context = drawingBoard.getContext("2d");
let strokeWidth = 0, strokeColor = "black";
let coords = {x: 0, y: 0};
let paint = false;

// Update Toolbar
function updateToolbarSettings(){
    strokeWidth = document.getElementById("stroke-width").value;
    strokeColor = document.getElementById("stroke-color").value;
}

// Download Image
function save(){
    const pngDataURL = drawingBoard.toDataURL("image/png");
    let downloadButton = document.getElementById("download-button");
    downloadButton.href = pngDataURL;
}

// Background Color Settings
function changeBackgroundTransparency(){
    let backgroundRow = document.getElementById("background-color-row");
    if (backgroundRow.style.display === "none"){
        backgroundRow.style.display = "block";
    } else {
        backgroundRow.style.display = "none";
    }
}

function changeBackground(){
    let color = document.getElementById("background-color").value;
    context.fillStyle = color;
    context.fillRect(0, 0, drawingBoard.width, drawingBoard.height);
}

function resize(){
    drawingBoard.width = 750;
    drawingBoard.height = 250;
}

function reload(){
    location.reload();
}

function getPosition(event){
    const rect = drawingBoard.getBoundingClientRect();
    const scaleX = drawingBoard.width / rect.width;
    const scaleY = drawingBoard.height / rect.height;
    coords.x = (event.clientX - rect.left) * scaleX;
    coords.y = (event.clientY - rect.top) * scaleY;
}
function startPainting(event){
    paint = true;
    getPosition(event); // Get initial position
    sketch(event); // Start drawing from initial position
}
function stopPainting(){
    paint = false;
}
function sketch(event){
    if (!paint){
        return;
    }
    context.beginPath();
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.lineCap = "round";
    context.moveTo(coords.x, coords.y);
    getPosition(event);
    context.lineTo(coords.x, coords.y);
    context.stroke();
}
