var mainCanvasContext = document.getElementById('main-canvas').getContext('2d')
var width = mainCanvasContext.canvas.width = window.innerWidth
var height = mainCanvasContext.canvas.height = window.innerHeight

var touch = 'createTouch' in document
var moveEvent = (touch) ? 'touchmove' : 'mousemove'
var isDocument = (mainCanvasContext.canvas == document)
var contextPos = {}

const SQUARE_SIZE = 50
var data = []

// Update context
function updateContextXY() {
  var context = mainCanvasContext.canvas
  if (isDocument) context = mainCanvasContext.canvas.body

  var left = 0
  var top = 0
  if (context.offsetParent) {
    do {
      left += context.offsetLeft
      top  += context.offsetTop
    } while (context = context.offsetParent)
  }

  contextPos = {
    x : left,
    y : top
  }
}

// Get point
function getXY(event) {
  event = (event.pageX)
    ? event
    : (event.touches && event.touches.length)
      ? event.touches[0]
      : { pageX: 0, pageY: 0 }
  return {
    x: event.pageX - document.body.scrollLeft - contextPos.x,
    y: event.pageY - document.body.scrollTop - contextPos.y,
  }
}

function draw() {
  // Clear canvas
  var canvas = mainCanvasContext.canvas
  mainCanvasContext.clearRect(0, 0, canvas.width, canvas.height)

  for (var i = 0; i < data.length; i++) {
    if (!data[i]) continue

    for (var j = 0; j < data[i].length; j++) {
      if (!data[i][j]) continue

      // Calculate center os square
      var square = {
        x: i * SQUARE_SIZE,
        y: j * SQUARE_SIZE,
        size: SQUARE_SIZE
      }

      // Draw square
      mainCanvasContext.fillStyle = "#00884a"
      mainCanvasContext.fillRect(square.x, square.y, square.size, square.size)
      mainCanvasContext.stroke()
    }
  }
}

// Listen for mouse moves
document.addEventListener(moveEvent, function (e) {
  e.preventDefault()

  var point = getXY(e)

  // Store square
  var x = Math.floor(point.x / SQUARE_SIZE)
  var y = Math.floor(point.y / SQUARE_SIZE)

  if (!data[x]) data[x] = []

  // Optimization: No need toñ redraw
  if (data[x][y]) return

  data[x][y] = true

  // Draw
  draw()
}, false)

// Update
updateContextXY()

window.onresize = function(event) {
  width = mainCanvasContext.canvas.width = window.innerWidth
  height = mainCanvasContext.canvas.height = window.innerHeight

  draw()
}
