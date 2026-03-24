import rawThoughts from './masonry/shower-thoughts.json'

const itemCount = 10_000
const cardHeight = 92
const gap = 12
const overscan = 6

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

const domCache: (HTMLDivElement | null)[] = new Array(itemCount).fill(null) // cache lifetime: on visibility changes
let mountedStart = 0
let mountedEnd = -1
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

function ensureNode(index: number): HTMLDivElement {
  let node = domCache[index]
  if (node != null) return node
  node = document.createElement('div')
  node.className = 'card'
  node.textContent = thoughts[index]!
  domCache[index] = node
  return node
}

function render(): void {
  const viewportHeight = document.documentElement.clientHeight
  const scrollTop = window.scrollY
  const { start, end } = getVisibleRange(scrollTop, viewportHeight)

  for (let i = mountedStart; i <= mountedEnd; i++) {
    if (i >= start && i <= end) continue
    const node = domCache[i]
    if (node != null) {
      if (node.parentNode != null) node.remove()
      domCache[i] = null
    }
  }

  for (let i = start; i <= end; i++) {
    const node = ensureNode(i)
    node.style.top = `${gap + i * (cardHeight + gap)}px`
    node.style.height = `${cardHeight}px`
    if (node.parentNode == null) stage.appendChild(node)
  }

  mountedStart = start
  mountedEnd = end
  hud.textContent = `mounted=${stage.childElementCount} range=${start}-${end}`
}

window.addEventListener('resize', () => scheduleRender())
window.addEventListener('scroll', () => scheduleRender(), true)

scheduleRender()
