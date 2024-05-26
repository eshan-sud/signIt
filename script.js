window.addEventListener("load", () => {
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mouseup", stopPainting);
    document.addEventListener("mousedown", startPainting);
    document.addEventListener("mousemove", sketch);
    document.addEventListener("touchend", stopPainting);
    document.addEventListener("touchstart", startTouchPainting, { passive: false });
    document.addEventListener("touchmove", touchSketch, { passive: false });
    backgroundColorSetting.addEventListener("click", changeBackgroundTransparency);
    document.getElementById("toolbar-settings").addEventListener("change", updateToolbarSettings);
});
// Drawing Board
const drawingBoard = document.getElementById("drawing-board");
const backgroundBoard = document.getElementById("background-board");
const drawingContext = drawingBoard.getContext("2d");
const backgroundContext = backgroundBoard.getContext("2d");
const backgroundColorSetting = document.getElementById("background-check");
let backgroundColor = "white", strokeWidth = 5, strokeColor = "black";
let coords = { x: 0, y: 0 };
let paint = false;
// Update the Toolbar Settings
function updateToolbarSettings() {
    strokeWidth = document.getElementById("stroke-width").value;
    strokeColor = document.getElementById("stroke-color").value;
    backgroundColor = document.getElementById("background-color").value;
    if (backgroundColorSetting.checked) {
        clearBackground();
        return;
    }
    backgroundContext.fillStyle = backgroundColor;
    backgroundContext.fillRect(0, 0, drawingBoard.width, drawingBoard.height);
}
// Background Color Settings
function changeBackgroundTransparency() {
    const backgroundRow = document.getElementById("background-color-row");
    backgroundRow.style.visibility = backgroundRow.style.visibility === "hidden" ? "visible" : "hidden";
    backgroundColorSetting.checked ? clearBackground() : updateToolbarSettings();
}
// Clears both the Canvases
function clearCanvas() {
    paint = false;
    drawingContext.clearRect(0, 0, drawingBoard.width, drawingBoard.height);
    backgroundContext.clearRect(0, 0, drawingBoard.width, drawingBoard.height);
    updateToolbarSettings();
}
// Clears the Background
function clearBackground() {
    backgroundContext.clearRect(0, 0, drawingBoard.width, drawingBoard.height);
}
// Resizes the Canvas
function resize() {
    let container = document.getElementById('canvas-container');
    let padding = parseFloat(window.getComputedStyle(container).paddingLeft);
    let width = container.clientWidth - (2 * padding);
    let height = container.clientHeight - (2 * padding);
    drawingContext.canvas.width = width;
    drawingContext.canvas.height = height;
    backgroundContext.canvas.width = width;
    backgroundContext.canvas.height = height;
    updateToolbarSettings();
}
// Gets the position of the Cursor
function getPosition(event, attribute="default") {
    let rect = drawingBoard.getBoundingClientRect();
    const scaleX = drawingBoard.width / rect.width;
    const scaleY = drawingBoard.height / rect.height;
    if (attribute === "default") {
        coords.x = (event.clientX - rect.left) * scaleX;
        coords.y = (event.clientY - rect.top) * scaleY;
    } else {
        coords.x = (event.touches[0].clientX - rect.left) * scaleX;
        coords.y = (event.touches[0].clientY - rect.top) * scaleY;
    }
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
        getPosition(event, "touch");
    }
}
// Sketchs the Drawing
function sketch(event) {
    if (!paint) return;
    drawingContext.beginPath();
    drawingContext.strokeStyle = strokeColor;
    drawingContext.lineWidth = strokeWidth;
    drawingContext.lineCap = "round";
    drawingContext.moveTo(coords.x, coords.y);
    getPosition(event);
    drawingContext.lineTo(coords.x, coords.y);
    drawingContext.stroke();
}
function touchSketch(event) {
    if (!paint) return;
    if (event.target === drawingBoard) {
        event.preventDefault();
        drawingContext.beginPath();
        drawingContext.strokeStyle = strokeColor;
        drawingContext.lineWidth = strokeWidth;
        drawingContext.lineCap = "round";
        drawingContext.moveTo(coords.x, coords.y);
        getPosition(event, "touch");
        drawingContext.lineTo(coords.x, coords.y);
        drawingContext.stroke();
    }
}
// Stops Painting
function stopPainting() {paint = false;}
// Saves the Canvas Image to Device
function save() {
    let imageData;
    if (!backgroundColorSetting.checked) {
        imageData = drawingContext.getImageData(0, 0, drawingBoard.width, drawingBoard.height);
        drawingContext.save();
        drawingContext.fillStyle = backgroundColor;
        drawingContext.globalCompositeOperation = "destination-over";
        drawingContext.fillRect(0, 0, drawingBoard.width, drawingBoard.height);
    }
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
    if (!backgroundColorSetting.checked) {
        drawingContext.clearRect(0, 0, drawingBoard.width, drawingBoard.height);
        drawingContext.putImageData(imageData, 0, 0);
        drawingContext.restore();
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
    const image = drawingBoard.toDataURL("image/jpg", 1.0);
    const pdf = new jsPDF();
    const canvasWidth = drawingBoard.width;
    const canvasHeight = drawingBoard.height;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
    const width = canvasWidth * ratio;
    const height = canvasHeight * ratio;
    const x = (pageWidth - width) / 2;
    const y = (pageHeight - height) / 2;
    pdf.addImage(image, 'JPG', x, y, width, height);
    pdf.save(`signature_${getTimestamp()}.pdf`);
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


var settingDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

document.addEventListener("DOMContentLoaded", function () {
    // Select Light/Dark Mode Default Setting
    settingDark == true ? setDarkMode() : setLightMode();
});

// Change To Light Mode
function setLightMode() {
    if (settingDark == true) {
        setDarkMode();
        return;
    }
    // Changing Icon
    var lightModeIcon = document.getElementById("light-mode-svg");
    var darkModeIcon = document.getElementById("dark-mode-svg");
    lightModeIcon.style.display = "flex";
    darkModeIcon.style.display = "none";

    // Changing Black to white and vice-vera
    let blacks1 = document.querySelectorAll(".back-black-white");
    let blacks2 = document.querySelectorAll(".back-white-black");
    let blacks3 = document.querySelectorAll(".back-dark-white");
    blacks1.forEach((element) => {
        element.classList.remove("back-black-white");
        element.classList.add("back-white-black");
    });
    blacks2.forEach((element) => {
        element.classList.remove("back-white-black");
        element.classList.add("back-black-white");
    });
    blacks3.forEach((element) => {
        element.classList.remove("back-dark-white");
        element.classList.add("back-white-dark");
    });

    let whites1 = document.querySelectorAll(".color-white-dark");
    whites1.forEach((element) => {
        element.classList.remove("color-white-dark");
        element.classList.add("color-dark-white");
    });

    settingDark = true;
}
// Change To Dark Mode
function setDarkMode() {
    if (settingDark == false) {
        setLightMode();
        return;
    }

    // Changing Icon
    var lightModeIcon = document.getElementById("light-mode-svg");
    var darkModeIcon = document.getElementById("dark-mode-svg");
    lightModeIcon.style.display = "none";
    darkModeIcon.style.display = "flex";

    // Changing Black to white and vice-vera
    let whites1 = document.querySelectorAll(".back-white-black");
    let whites2 = document.querySelectorAll(".back-black-white");
    let whites3 = document.querySelectorAll(".back-white-dark");
    whites1.forEach((element) => {
        element.classList.remove("back-white-black");
        element.classList.add("back-black-white");
    });
    whites2.forEach((element) => {
        element.classList.remove("back-black-white");
        element.classList.add("back-white-black");
    });
    whites3.forEach((element) => {
        element.classList.remove("back-white-dark");
        element.classList.add("back-dark-white");
    });

    let blacks = document.querySelectorAll(".color-dark-white");
    blacks.forEach((element) => {
        element.classList.remove("color-dark-white");
        element.classList.add("color-white-dark");
    });

    settingDark = false;
}