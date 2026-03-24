const hud = document.createElement('div')
hud.className = 'hud'
document.body.appendChild(hud)

let scheduled = false
let frame = 0

function scheduleRender(): void {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(function renderAndMaybeScheduleAnotherRender() {
    scheduled = false
    render()
  })
}

function render(): void {
  hud.textContent = `scrollY=${Math.round(window.scrollY)} frame=${frame}`
  frame++
}

window.addEventListener('scroll', () => scheduleRender(), true)
window.addEventListener('resize', () => scheduleRender())

scheduleRender()
