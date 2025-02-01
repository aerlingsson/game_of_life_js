const HEIGHT = 1024
const WIDTH = 1024
const CELL_SIZE = 32
const CELL_LIVE_COLOR = "lime"
const TICK_TIME = 100

const BACKGROUND_COLOR = "#1e1f1e";

document.body.style.backgroundColor = BACKGROUND_COLOR

if ((HEIGHT % CELL_SIZE) != 0 || (WIDTH % CELL_SIZE) != 0)
    alert("Canvas size and cell size not divisible")

let started = false;
const startStopButton = document.getElementById("startButton")

function flipStartButton() {
    started = !started
    startStopButton.innerText = started ? "Stop" : "Start"
}

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
ctx.canvas.height = HEIGHT
ctx.canvas.width = WIDTH

let cells = [[]]

function drawCell(c) {
    ctx.strokeStyle = "black"
    ctx.strokeRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
    ctx.fillStyle = c.live ? CELL_LIVE_COLOR : BACKGROUND_COLOR
    ctx.fillRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
}

function drawCells() {
    cells.forEach(row => row.forEach(drawCell))
}

function setup() {
    for (let x = 0; x <= WIDTH / CELL_SIZE; x++) {
        const row = []

        for (let y = 0; y <= HEIGHT / CELL_SIZE; y++)
            row.push({ x: x * CELL_SIZE, y: y * CELL_SIZE, live: Math.random() > 0.90 })

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

startStopButton.addEventListener("click", flipStartButton)

document.getElementById("resetButton").addEventListener("click", () => {
    if (started)
        flipStartButton()
    setup()
})

function tick() {
    if (started) {
        cells.forEach((row, x) => {
            row.forEach((cell, y) => {
                const liveNeighborsCount = liveNeighbors(x, y)

                if (liveNeighborsCount < 2)
                    cell.live = false
                if (liveNeighborsCount === 2 || liveNeighborsCount === 3)
                    cell.live = cell.live
                if (liveNeighborsCount > 3)
                    cell.live = false
                if (liveNeighborsCount === 3 && !cell.live)
                    cell.live = true
            })
        })

        drawCells()
    }

    setTimeout(tick, TICK_TIME)
}

console.log("Init...")
setup()
drawCells()
console.log("Done")
tick()
