const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

var selectedColor = 'black'
var lastPoint;
var isLogin = 1

function resize() {
    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight * 0.75;
}

function chooseColor(clr) {
    selectedColor = clr
}

// function draw() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
// }

function broadcast(data) {
    Object.values(peerConnections).forEach(peer => {
        peer.send(data);
    });
}

function onPeerData(id, data) {
    draw(JSON.parse(data));
}

function draw(data) {
    context.beginPath();
    context.moveTo(data.lastPoint.x, data.lastPoint.y);
    context.lineTo(data.x, data.y);
    context.strokeStyle = data.color;
    context.lineWidth = 5
    context.lineCap = 'round';
    context.stroke();
}


function move(e) {
    if (e.buttons) {
        if (!lastPoint) {
            lastPoint = { x: e.offsetX, y: e.offsetY };
            return;
        }

        draw({
            lastPoint,
            x: e.offsetX,
            y: e.offsetY,
            color: selectedColor
        });

        broadcast(JSON.stringify({
            lastPoint,
            x: e.offsetX,
            y: e.offsetY,
            color: selectedColor
        }));

        lastPoint = { x: e.offsetX, y: e.offsetY };
    }

}



function saveName() {
    let newName = document.getElementById("enter-name").value
    let data = { name: newName, id: localId }
    Object.values(peerConnections).forEach(peer => {
        peer.send(data);
    });
}


window.onresize = resize;
resize();
window.onmousemove = move;