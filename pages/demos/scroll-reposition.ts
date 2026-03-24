const itemCount = 10_000
const cardHeight = 92
const gap = 12
const overscan = 6
const poolSize = 24

const stage = document.createElement('div')
stage.className = 'stage'
stage.style.height = `${itemCount * (cardHeight + gap) + gap}px`
document.body.appendChild(stage)

const pool: HTMLDivElement[] = []
for (let i = 0; i < poolSize; i++) {
  const node = document.createElement('div')
  node.className = 'card'
  node.textContent = `Reused card ${i + 1}. Same DOM node, same text, only top changes while scrolling.`
  stage.appendChild(node)
  pool.push(node)
}

let scheduled = false

function scheduleRender(): void {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(function renderAndMaybeScheduleAnotherRender() {
    scheduled = false
    render()
  })
}

function render(): void {
  const viewportHeight = document.documentElement.clientHeight
  const scrollTop = window.scrollY
  const rowSpan = cardHeight + gap
  const start = Math.max(0, Math.floor(scrollTop / rowSpan) - overscan)
  const visibleCount = Math.ceil(viewportHeight / rowSpan) + overscan * 2

  for (let slot = 0; slot < pool.length; slot++) {
    const node = pool[slot]!
    const index = start + slot
    if (slot < visibleCount && index < itemCount) {
      node.style.top = `${gap + index * rowSpan}px`
      node.style.display = 'block'
    } else {
      node.style.display = 'none'
    }
  }
}

window.addEventListener('resize', () => scheduleRender())
window.addEventListener('scroll', () => scheduleRender(), true)

scheduleRender()
