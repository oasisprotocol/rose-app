import React, { useState } from 'react'
import { Button } from '../Button'

interface Props {
  label: string
  children: React.ReactNode
}

export const RevealOverlayButton = (props: Props) => {
  const [hasRevealed, setHasRevealed] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <Button
        style={{
          visibility: hasRevealed ? 'hidden' : 'visible',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          height: 'auto',
          borderRadius: '12px',
        }}
        onClick={() => setHasRevealed(true)}
      >
        {props.label}
      </Button>
      <div style={{ visibility: hasRevealed ? 'visible' : 'hidden' }}>{props.children}</div>
    </div>
  )
}
