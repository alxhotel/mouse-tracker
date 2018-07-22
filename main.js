var mainCanvasContext = document.getElementById('main-canvas').getContext('2d')
var width = mainCanvasContext.canvas.width = window.innerWidth
var height = mainCanvasContext.canvas.height = window.innerHeight

var touch = 'createTouch' in document
var moveEvent = (touch) ? 'touchmove' : 'mousemove'

var isDocument = (mainCanvasContext.canvas == document)
var contextPos = {}

var data = []
var maxPoints = 100

function updateContextXY() {
  var context = mainCanvasContext.canvas
  var ctx = context
  if (isDocument) ctx = context.body

  var left = 0
  var top = 0
  if (ctx.offsetParent) {
    do {
      left += ctx.offsetLeft
      top  += ctx.offsetTop
    } while (ctx = ctx.offsetParent)
  }

  contextPos = {
    x : left,
    y : top
  }
}

function getXY(event) {
  event = event.pageX ? event : event.touches.length ? event.touches[0] : { pageX: 0, pageY: 0 }
  return {
    x: event.pageX - document.body.scrollLeft - contextPos.x,
    y: event.pageY - document.body.scrollTop - contextPos.y,
  }
}

function draw() {
  // Clear canvas
  mainCanvasContext.clearRect(0, 0, width, height);

  // Setup stroke
  mainCanvasContext.strokeStyle = "#df4b26";
  mainCanvasContext.lineJoin = "round";
  mainCanvasContext.lineWidth = 5;

  // Draw line
  for (var i = 0; i < data.length; i++) {
    mainCanvasContext.beginPath();
    if (data[i] && i) {
      mainCanvasContext.moveTo(data[i-1].x, data[i-1].y);
    } else {
      mainCanvasContext.moveTo(data[i] - 1, data[i].y);
    }
    mainCanvasContext.lineTo(data[i].x, data[i].y);
    mainCanvasContext.closePath();
    mainCanvasContext.stroke();
  }
console.log(data)
}

// Listen for mouse moves
document.addEventListener(moveEvent, function (e) {
  e.preventDefault()

  // Check we are on top of canvas
  if (e.target.nodeName !== 'CANVAS') return

  // Add point to data
  data.push(getXY(e))

  // If more than 100 points, drop the old data
  if (data.length > maxPoints) {
    data.shift()
  }

  // Draw
  draw()
}, false)

// Update
updateContextXY()

window.onresize = function(event) {
  updateContextXY()
}
