import rawThoughts from './masonry/shower-thoughts.json'

const totalItems = 10_000
const visibleCount = 150
const advancePerFrame = 30
const gap = 12

type CardLayout = {
  x: number
  y: number
  width: number
  height: number
}

const stage = document.createElement('div')
stage.className = 'stage'
document.body.appendChild(stage)

const hud = document.createElement('div')
hud.className = 'hud'
document.body.appendChild(hud)

const thoughts: string[] = new Array(totalItems)
for (let i = 0; i < totalItems; i++) {
  thoughts[i] = rawThoughts[i % rawThoughts.length]!
}

const domCache: (HTMLDivElement | null)[] = new Array(totalItems).fill(null) // cache lifetime: on visibility changes
const cardLayouts: CardLayout[] = new Array(visibleCount)

let windowStart = 0
let lastWidth = -1
let lastHeight = -1
let frame = 0

function recomputeSlotLayouts(width: number, height: number): void {
  const minCardWidth = 140
  const colCount = Math.max(2, Math.floor((width - gap) / (minCardWidth + gap)))
  const cardWidth = Math.floor((width - gap * (colCount + 1)) / colCount)

  for (let slot = 0; slot < visibleCount; slot++) {
    const column = slot % colCount
    const row = Math.floor(slot / colCount)
    cardLayouts[slot] = {
      x: gap + column * (cardWidth + gap),
      y: gap + row * 82,
      width: cardWidth,
      height: Math.min(70, height - gap * 2),
    }
  }

  lastWidth = width
  lastHeight = height
}

function createNode(index: number): HTMLDivElement {
  const node = document.createElement('div')
  node.className = 'card'
  node.textContent = thoughts[index]!
  domCache[index] = node
  return node
}

function render(): void {
  const width = document.documentElement.clientWidth
  const height = document.documentElement.clientHeight

  if (width !== lastWidth || height !== lastHeight) recomputeSlotLayouts(width, height)

  const windowEnd = Math.min(totalItems, windowStart + visibleCount)
  const previousStart = Math.max(0, windowStart - advancePerFrame)
  const previousEnd = Math.min(totalItems, previousStart + visibleCount)

  for (let index = previousStart; index < previousEnd; index++) {
    if (index >= windowStart && index < windowEnd) continue
    const node = domCache[index]
    if (node != null) {
      if (node.parentNode != null) node.remove()
      domCache[index] = null
    }
  }

  for (let index = windowStart; index < windowEnd; index++) {
    let node = domCache[index]
    if (node == null) node = createNode(index)
    const layout = cardLayouts[index - windowStart]!
    node.style.left = `${layout.x}px`
    node.style.top = `${layout.y}px`
    node.style.width = `${layout.width}px`
    node.style.height = `${layout.height}px`
    if (node.parentNode == null) stage.appendChild(node)
  }

  hud.textContent = `window=${windowStart}-${windowEnd - 1} mounted=${stage.childElementCount} frame=${frame}`
  frame++
  windowStart += advancePerFrame
  if (windowStart + visibleCount > totalItems) windowStart = 0
  requestAnimationFrame(render)
}

requestAnimationFrame(render)
