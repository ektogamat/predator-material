export const cloakSettings = {
  forceCloak: false,
  toggleCloak() {
    this.forceCloak = !this.forceCloak
  },
}

if (import.meta.env.DEV) {
  globalThis.__cloakSettings = cloakSettings
}
