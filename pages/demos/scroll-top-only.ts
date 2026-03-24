const poolSize = 24
const rowSpan = 104

const stage = document.createElement('div')
stage.className = 'stage'
document.body.appendChild(stage)

const pool: HTMLDivElement[] = []
for (let i = 0; i < poolSize; i++) {
  const node = document.createElement('div')
  node.className = 'card'
  node.textContent = `Card ${i + 1}. Same DOM node, same text, same visibility. Only top changes on scroll.`
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
  const start = Math.floor(window.scrollY / rowSpan)
  for (let i = 0; i < pool.length; i++) {
    const node = pool[i]!
    node.style.top = `${12 + (start + i) * rowSpan}px`
  }
}

window.addEventListener('scroll', () => scheduleRender(), true)
window.addEventListener('resize', () => scheduleRender())

scheduleRender()
