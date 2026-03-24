import rawThoughts from './masonry/shower-thoughts.json'

const itemCount = 10_000
const cardHeight = 92
const gap = 12
const overscan = 6

type PoolNode = {
  index: number
  node: HTMLDivElement
}

const stage = document.createElement('div')
stage.className = 'stage'
document.body.appendChild(stage)

const hud = document.createElement('div')
hud.className = 'hud'
document.body.appendChild(hud)

const thoughts: string[] = new Array(itemCount)
for (let i = 0; i < itemCount; i++) {
  thoughts[i] = rawThoughts[i % rawThoughts.length]!
}

const pool: PoolNode[] = []
let poolSize = 0
let scheduled = false

stage.style.height = `${itemCount * (cardHeight + gap) + gap}px`

function scheduleRender(): void {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(function renderAndMaybeScheduleAnotherRender() {
    scheduled = false
    render()
  })
}

function getVisibleRange(scrollTop: number, viewportHeight: number): { start: number, end: number } {
  const rowSpan = cardHeight + gap
  const rawStart = Math.floor(scrollTop / rowSpan) - overscan
  const rawEnd = Math.ceil((scrollTop + viewportHeight) / rowSpan) + overscan
  const start = Math.max(0, rawStart)
  const end = Math.min(itemCount - 1, rawEnd)
  return { start, end }
}

function ensurePool(size: number): void {
  if (size <= poolSize) return

  for (let i = poolSize; i < size; i++) {
    const node = document.createElement('div')
    node.className = 'card'
    stage.appendChild(node)
    pool.push({ index: -1, node })
  }

  poolSize = size
}

function render(): void {
  const viewportHeight = document.documentElement.clientHeight
  const scrollTop = window.scrollY
  const { start, end } = getVisibleRange(scrollTop, viewportHeight)
  const visibleCount = end - start + 1

  ensurePool(visibleCount)

  for (let slot = 0; slot < pool.length; slot++) {
    const entry = pool[slot]!
    if (slot < visibleCount) {
      const index = start + slot
      entry.index = index
      entry.node.textContent = thoughts[index]!
      entry.node.style.top = `${gap + index * (cardHeight + gap)}px`
      entry.node.style.height = `${cardHeight}px`
      entry.node.style.display = 'block'
    } else {
      entry.index = -1
      entry.node.style.display = 'none'
    }
  }

  hud.textContent = `pool=${pool.length} visible=${visibleCount} range=${start}-${end}`
}

window.addEventListener('resize', () => scheduleRender())
window.addEventListener('scroll', () => scheduleRender(), true)

scheduleRender()
