import React, { useMemo } from 'react'

const LETTER_SRC = {
  A: '/yautja/A.png',
  B: '/yautja/B.png',
  C: '/yautja/C.png',
  D: '/yautja/D.png',
  E: '/yautja/E.png',
  F: '/yautja/F.png',
  G: '/yautja/G.png',
  H: '/yautja/H.png',
  I: '/yautja/I.png',
  J: '/yautja/J.png',
  K: '/yautja/K.png',
  L: '/yautja/L.png',
  M: '/yautja/M.png',
  N: '/yautja/N.png',
  O: '/yautja/O.png',
  P: '/yautja/P.png',
  Q: '/yautja/Q.png',
  R: '/yautja/R.png',
  S: '/yautja/S.png',
  T: '/yautja/T.png',
  U: '/yautja/U.png',
  V: '/yautja/V.png',
  W: '/yautja/W.png',
  X: '/yautja/X.png',
  Y: '/yautja/Y.png',
  Z: '/yautja/Z.png',
}

const STAGGER_MS = 70

export default function YautjaText({ text, active = false, className = '' }) {
  const chars = useMemo(() => String(text).toUpperCase().split(''), [text])

  let letterStep = 0

  return (
    <div
      className={`yautja-text ${active ? 'is-active' : ''} ${className}`.trim()}
      aria-label={text}
      role="img">
      {chars.map((char, index) => {
        if (char === ' ') {
          letterStep += 1
          return (
            <span
              key={`space-${index}`}
              className="yautja-space"
              style={{ '--yautja-step': letterStep - 1 }}
            />
          )
        }

        const src = LETTER_SRC[char]
        if (!src) {
          return null
        }

        const step = letterStep
        letterStep += 1

        return (
          <img
            key={`${char}-${index}-${active ? 'on' : 'off'}`}
            className="yautja-letter"
            src={src}
            alt=""
            draggable={false}
            style={{
              '--yautja-step': step,
              animationDelay: active ? `${step * STAGGER_MS}ms` : '0ms',
            }}
          />
        )
      })}
    </div>
  )
}

export { STAGGER_MS }
