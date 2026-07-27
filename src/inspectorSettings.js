let inspectorRef = null

export const inspectorSettings = {
  visible: false,

  attach(inspector) {
    inspectorRef = inspector
    this.setVisible(this.visible)
  },

  toggle() {
    this.setVisible(!this.visible)
  },

  setVisible(visible) {
    this.visible = visible
    if (inspectorRef?.domElement) {
      inspectorRef.domElement.style.display = visible ? '' : 'none'
    }
  },
}

if (import.meta.env.DEV) {
  globalThis.__inspectorSettings = inspectorSettings
}
