const HEIGHT = 1024
const WIDTH = 1024
const CELL_SIZE = 32
const CELL_LIVE_COLOR = "lime"
const TICK_TIME = 100
const RANDOM_THRESHOLD = 0.9

const BACKGROUND_COLOR = "#1e1f1e";

document.body.style.backgroundColor = BACKGROUND_COLOR

if ((HEIGHT % CELL_SIZE) != 0 || (WIDTH % CELL_SIZE) != 0)
    alert("Canvas size and cell size not divisible")

let started = false;
const startStopButton = document.getElementById("startButton")
const resetButton = document.getElementById("resetButton")
const randomButton = document.getElementById("randomButton")

const canvas = document.getElementById("canvas")
const canvasRect = canvas.getBoundingClientRect()

const canvasCtx = canvas.getContext("2d")
canvasCtx.canvas.height = HEIGHT
canvasCtx.canvas.width = WIDTH

function flipStartButton() {
    started = !started
    startStopButton.innerText = started ? "Stop" : "Start"
}

let cells = [[]]

function drawCell(c) {
    canvasCtx.strokeStyle = "black"
    canvasCtx.strokeRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
    canvasCtx.fillStyle = c.live ? CELL_LIVE_COLOR : BACKGROUND_COLOR
    canvasCtx.fillRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
}

function drawCells() {
    cells.forEach(row => row.forEach(drawCell))
}

function setup(random) {
    for (let x = 0; x <= WIDTH / CELL_SIZE; x++) {
        const row = []

        for (let y = 0; y <= HEIGHT / CELL_SIZE; y++)
            row.push({ x: x * CELL_SIZE, y: y * CELL_SIZE, live: random ? Math.random() > RANDOM_THRESHOLD : false })

        cells.push(row)
    }

    drawCells()
}

function liveNeighbors(x, y) {
    function existsOrNull(x1, y1) {
        try {
            return cells[x1][y1] === undefined ? null : cells[x1][y1]
        } catch {
            return null
        }
    }

    const neighbors = [
        existsOrNull(x - 1, y - 1), // up left
        existsOrNull(x, y - 1),     // up
        existsOrNull(x + 1, y - 1), // up right
        existsOrNull(x - 1, y),     // left
        existsOrNull(x + 1, y),     // right
        existsOrNull(x - 1, y + 1), // down left
        existsOrNull(x, y + 1),     // down
        existsOrNull(x + 1, y + 1)  // down right
    ].filter(n => n !== null)

    return neighbors.filter((n) => n.live).length
}

function tick() {
    if (started) {
        cells.forEach((row, x) => {
            row.forEach((cell, y) => {
                const liveNeighborsCount = liveNeighbors(x, y)

                // https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Rules
                // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
                if (liveNeighborsCount < 2)
                    cell.live = false
                // Any live cell with two or three live neighbours lives on to the next generation.
                if (liveNeighborsCount === 2 || liveNeighborsCount === 3)
                    cell.live = cell.live
                // Any live cell with more than three live neighbours dies, as if by overpopulation.
                if (liveNeighborsCount > 3)
                    cell.live = false
                // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                if (liveNeighborsCount === 3 && !cell.live)
                    cell.live = true
            })
        })

        drawCells()
    }

    setTimeout(tick, TICK_TIME)
}

startStopButton.addEventListener("click", flipStartButton)

resetButton.addEventListener("click", () => setup(false))

randomButton.addEventListener("click", () => {
    if (started)
        flipStartButton()
    setup(true)
})

console.log("Init...")
setup(true)

canvas.addEventListener("click", (event) => {
    event.preventDefault()

    const x = event.offsetX
    const y = event.offsetY

    cells.forEach(row => {
        row.forEach(cell => {
            if (x >= cell.x && x < cell.x + CELL_SIZE && y >= cell.y && y < cell.y + CELL_SIZE) {
                console.log(cell)
                cell.live = !cell.live
                drawCells()
            }
        })
    })

    console.log("Click", x, y)
})

drawCells()
console.log("Done")
tick()
