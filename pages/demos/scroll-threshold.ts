const presetHeights = [
  200_000,
  300_000,
  400_000,
  600_000,
  800_000,
  1_000_000,
  1_200_000,
  1_400_000,
  1_652_938,
] as const

function parseHeight(): number {
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('h')
  if (raw == null) return 200_000
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return 200_000
  return parsed
}

function formatHeight(height: number): string {
  return `${height.toLocaleString()}px`
}

const height = parseHeight()

const hud = document.createElement('div')
hud.className = 'hud'
document.body.appendChild(hud)

const title = document.createElement('h1')
title.textContent = 'Scroll Threshold Probe'
hud.appendChild(title)

const description = document.createElement('p')
description.textContent = `Current total scroll height: ${formatHeight(height)}`
hud.appendChild(description)

const instructions = document.createElement('p')
instructions.textContent = 'Use the iPhone scrollbar grab/flick gesture that usually crashes Safari, then step upward until it breaks.'
hud.appendChild(instructions)

const presetList = document.createElement('div')
presetList.className = 'preset-list'
hud.appendChild(presetList)

for (let i = 0; i < presetHeights.length; i++) {
  const presetHeight = presetHeights[i]!
  const link = document.createElement('a')
  link.className = presetHeight === height ? 'preset preset--active' : 'preset'
  link.href = `?h=${presetHeight}`
  link.textContent = formatHeight(presetHeight)
  presetList.appendChild(link)
}

const custom = document.createElement('p')
custom.textContent = 'You can also edit the URL query manually, e.g. ?h=500000'
hud.appendChild(custom)

const spacer = document.createElement('div')
spacer.className = 'spacer'
spacer.style.height = `${height}px`
document.body.appendChild(spacer)
