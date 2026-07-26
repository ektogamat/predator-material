import React, { useEffect, useRef, useState } from 'react'

export default function Overlay() {
  const audioRef = useRef(null)
  const [soundOn, setSoundOn] = useState(true)

  const handleMouseDown = () => {
    window.document.body.style.cursor = 'grabbing'
  }

  const handleMouseUp = () => {
    window.document.body.style.cursor = 'grab'
  }

  useEffect(() => {
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
    audio.volume = 0.45
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

  return (
    <div className="container">
      <header>
        <h3
          onClick={() => {
            window.open('https://andersonmancini.dev', 'tab')
          }}>
          ANDERSONMANCINI.DEV
        </h3>

        <div className="header-actions">
          <button className="ctaButton contact soundToggle" onClick={toggleSound} type="button">
            {soundOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>
          <button
            className="ctaButton contact"
            onClick={() => {
              window.open('https://andersonmancini.dev', 'tab')
            }}>
            GET IN TOUCH
          </button>
        </div>
      </header>
      <section className="overlay">
        <h1>Predator Cloak Material for React Three Fiber</h1>
      </section>
      <footer>Hover to morph - Created by Anderson Mancini.</footer>
    </div>
  )
}
