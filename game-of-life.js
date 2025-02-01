const HEIGHT = 512
const WIDTH = 512
const CELL_SIZE = 32
const CELL_LIVE_COLOR = "lime"

const BACKGROUND_COLOR = "#1e1f1e";

document.body.style.backgroundColor = BACKGROUND_COLOR

if ((HEIGHT % CELL_SIZE) != 0 || (WIDTH % CELL_SIZE) != 0)
    alert("Canvas size and cell size not divisible")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
ctx.canvas.height = HEIGHT
ctx.canvas.width = WIDTH

let cells = [[]]

for (let x = 0; x <= WIDTH / CELL_SIZE; x++) {
    const row = []

    for (let y = 0; y <= HEIGHT / CELL_SIZE; y++)
        row.push({ x: x * CELL_SIZE, y: y * CELL_SIZE, live: Math.random() > 0.85 })

    cells.push(row)
}

function drawCell(c) {
    ctx.strokeStyle = "black"
    ctx.strokeRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
    ctx.fillStyle = c.live ? CELL_LIVE_COLOR : BACKGROUND_COLOR
    ctx.fillRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
}

function drawCells() {
    cells.forEach(row => row.forEach(drawCell))
}

function liveNeighbors(x, y) {
    function existsOrNull(x1, y1) {
        try {
            return cells[x1][y1] === undefined ? null : cells[x1][y1]
        } catch {
            return null
        }
    }

    const upLeft = existsOrNull(x - 1, y - 1)
    const up = existsOrNull(x, y - 1)
    const upRight = existsOrNull(x + 1, y - 1)
    const left = existsOrNull(x - 1, y)
    const right = existsOrNull(x + 1, y)
    const downLeft = existsOrNull(x - 1, y + 1)
    const down = existsOrNull(x, y + 1)
    const downRight = existsOrNull(x + 1, y + 1)

    const neighbors = [
        upLeft,
        up,
        upRight,
        left,
        right,
        downLeft,
        down,
        downRight
    ].filter(n => n !== null)

    return neighbors.filter((n) => n.live).length
}

function tick() {
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
    setTimeout(tick, 100)
}

console.log("Init...")
drawCells()
console.log("Done")
tick()

