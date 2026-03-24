import rawThoughts from './masonry/shower-thoughts.json'

function hash(n: number): number {
  n = Math.imul((n >>> 16) ^ n, 0x21f0aaad)
  n = Math.imul((n >>> 15) ^ n, 0x735a2d97)
  return (((n >>> 15) ^ n) >>> 0) / 0x100000000
}

const itemCount = 10_000
const rowSpan = 104
const poolSize = 24

const thoughts: string[] = new Array(itemCount)
for (let i = 0; i < itemCount; i++) {
  thoughts[i] = rawThoughts[i % rawThoughts.length]!
}

const stage = document.createElement('div')
stage.className = 'stage'
document.body.appendChild(stage)

const pool: HTMLDivElement[] = []
for (let i = 0; i < poolSize; i++) {
  const node = document.createElement('div')
  node.className = 'card'
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
    const index = start + i
    const node = pool[i]!
    if (index < itemCount) {
      node.textContent = thoughts[index]!
      node.style.top = `${12 + index * rowSpan}px`
      node.style.height = `${56 + Math.floor(hash(index) * 120)}px`
    }
  }
}

window.addEventListener('scroll', () => scheduleRender(), true)
window.addEventListener('resize', () => scheduleRender())

scheduleRender()
