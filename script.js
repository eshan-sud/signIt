
window.addEventListener("load", () => {
    resize();
    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousemove", sketch);
    window.addEventListener("resize", resize);
    const toolBar = document.getElementById("toolbar-settings");
    toolBar.addEventListener("change", updateToolbarSettings);
    document.getElementById("background-check").addEventListener("click", changeBackgroundTransparency);
    document.getElementById("background-color").addEventListener("click", changeBackground);
});

// Drawing Board
const drawingBoard = document.getElementById("drawing-board");
const context = drawingBoard.getContext("2d");
let boardWidth = 100, boardHeight = 100;
let strokeWidth = 0, strokeColor = "black";
let coords = {x:0 , y:0};
let paint = false;

// Update TooBar
function updateToolbarSettings(){
    strokeWidth = document.getElementById("stroke-width").value;
    strokeColor = document.getElementById("stroke-color").value;
}

// Download Image
function save(){
    // const documentSelection = document.getElementById("download-options").value;
    // let selection = {
    //     "png": "images/png",
    //     "jpeg": "image/jpeg",
    //     "jpg": "image/jpg",
    //     "pdf": "images/pdf"
    // };
    // const pngDataURL = drawingBoard.toDataURL(selection["documentSelection"]);
    const pngDataURL = drawingBoard.toDataURL("images/png");
    let downloadButton = document.getElementById("download-button");
    downloadButton.href = pngDataURL;
}

// Background Color Settings
function changeBackgroundTransparency(){
    backgroundRow = document.getElementById("background-color-row");
    if (backgroundRow.style.display == "none"){
        backgroundRow.style.display = "block";
        return;
    }
    backgroundRow.style.display = "none";
}
function changeBackground(){
    let color = document.getElementById("background-color").value;
    context.save();
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

//////////////////////////////////////////////////////////////////////////

function downloadCanvas(){
    let downloadOption = document.getElementById("download-options").getValue;
    console.log(downloadOption);
}

function resize(){
    // context.canvas.width = window.innerWidth;
    // context.canvas.height = window.innerHeight;
    context.canvas.width = 750;
    context.canvas.height = 250;
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
    getPosition(event);
}
function stopPainting(){
    paint = false;
}
function sketch(event){
    if (!paint){
        return;
    }
    else{
        context.beginPath();
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeWidth;
        context.lineCap = "round";
        context.moveTo(coords.x, coords.y);
        getPosition(event);
        context.lineTo(coords.x , coords.y);
        context.stroke();
    }
}

