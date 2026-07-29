export const hoverSettings = {
  hovered: false,
  holding: false,
  setHovered(value) {
    this.hovered = Boolean(value)
  },
  setHolding(value) {
    this.holding = Boolean(value)
  },
}

if (import.meta.env.DEV) {
  globalThis.__hoverSettings = hoverSettings
}
