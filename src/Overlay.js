import React, { useEffect, useRef, useState } from 'react'
import { cloakSettings } from './cloakSettings'
import { hoverSettings } from './hoverSettings'
import { inspectorSettings } from './inspectorSettings'
import YautjaText, { STAGGER_MS } from './YautjaText'

const YAUTJA_MESSAGE = 'CLICK FOR INVISIBILY'
const YAUTJA_STEPS = YAUTJA_MESSAGE.length
const TRANSLATION_DELAY_MS = YAUTJA_STEPS * STAGGER_MS + 180

export default function Overlay() {
  const audioRef = useRef(null)
  const [soundOn, setSoundOn] = useState(true)
  const [cloakPinned, setCloakPinned] = useState(false)
  const [modelHovered, setModelHovered] = useState(false)
  const [modelHolding, setModelHolding] = useState(false)
  const [inspectorVisible, setInspectorVisible] = useState(false)
  const isDev = import.meta.env.DEV
  const showYautjaHint = modelHovered && !modelHolding
  const hideChrome = modelHovered

  useEffect(() => {
    const syncCloakPin = () => {
      setCloakPinned((prev) =>
        prev === cloakSettings.forceCloak ? prev : cloakSettings.forceCloak,
      )
    }

    const id = window.setInterval(syncCloakPin, 200)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const syncHover = () => {
      setModelHovered((prev) =>
        prev === hoverSettings.hovered ? prev : hoverSettings.hovered,
      )
      setModelHolding((prev) =>
        prev === hoverSettings.holding ? prev : hoverSettings.holding,
      )
    }

    const id = window.setInterval(syncHover, 50)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!isDev) return

    const syncInspector = () => {
      setInspectorVisible((prev) =>
        prev === inspectorSettings.visible ? prev : inspectorSettings.visible,
      )
    }

    const id = window.setInterval(syncInspector, 200)
    return () => window.clearInterval(id)
  }, [isDev])

  useEffect(() => {
    const handleMouseDown = () => {
      window.document.body.style.cursor = 'grabbing'
    }

    const handleMouseUp = () => {
      window.document.body.style.cursor = 'grab'
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  useEffect(() => {
    const audio = new Audio('/predator-theme.mp3')
    audio.loop = true
    audio.volume = 0.25
    audioRef.current = audio

    const tryPlay = () => {
      audio.play().catch(() => {})
    }

    tryPlay()

    const unlock = () => {
      tryPlay()
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  const toggleSound = () => {
    const audio = audioRef.current
    if (!audio) return

    if (soundOn) {
      audio.pause()
      setSoundOn(false)
    } else {
      audio.play().catch(() => {})
      setSoundOn(true)
    }
  }

  const toggleCloakPin = () => {
    cloakSettings.toggleCloak()
    setCloakPinned(cloakSettings.forceCloak)
  }

  const toggleInspector = () => {
    inspectorSettings.toggle()
    setInspectorVisible(inspectorSettings.visible)
  }

  return (
    <div className={`container ${hideChrome ? 'is-model-focused' : ''}`}>
      <header className="site-header ui-chrome">
        <h3
          onClick={() => {
            window.open('https://andersonmancini.dev', 'tab')
          }}>
          ANDERSONMANCINI.DEV
        </h3>
      </header>

      <div
        className={`yautja-hud ${showYautjaHint ? 'is-visible' : ''}`}
        aria-hidden={!showYautjaHint}>
        <div className="yautja-hud-panel">
          <YautjaText text={YAUTJA_MESSAGE} active={showYautjaHint} />
          <p
            key={showYautjaHint ? 'translation-on' : 'translation-off'}
            className="yautja-translation"
            style={{ animationDelay: `${TRANSLATION_DELAY_MS}ms` }}>
            {YAUTJA_MESSAGE}
          </p>
        </div>
      </div>

      <div className="bottom-bar ui-chrome">
        <div className="bottom-bar-copy">
          <h1>Predator Cloak Material</h1>
          <span className="bottom-bar-badge">React Three Fiber</span>
          <p className="bottom-bar-hint">
            {cloakPinned ? 'Cloak pinned — orbit to record' : 'Hover to morph'} — Created by
            Anderson Mancini.
          </p>
        </div>

        <div className="bottom-bar-actions">
          <button className="ctaButton contact soundToggle" onClick={toggleCloakPin} type="button">
            {cloakPinned ? 'CLOAK PINNED' : 'PIN CLOAK'}
          </button>
          <button className="ctaButton contact soundToggle" onClick={toggleSound} type="button">
            {soundOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>
          {isDev && (
            <button className="ctaButton contact soundToggle" onClick={toggleInspector} type="button">
              {inspectorVisible ? 'HIDE INSPECTOR' : 'SHOW INSPECTOR'}
            </button>
          )}
          <button
            className="ctaButton contact"
            onClick={() => {
              window.open('https://andersonmancini.dev', 'tab')
            }}>
            GET IN TOUCH
          </button>
        </div>
      </div>
    </div>
  )
}
