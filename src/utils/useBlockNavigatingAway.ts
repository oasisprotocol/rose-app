import { useState } from 'react'

let globalIsBlocking = false // If useBlockNavigatingAway gets destroyed, load state from this.

const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  // Included for legacy support, e.g. Chrome/Edge < 119
  event.returnValue = true
}

export function useBlockNavigatingAway() {
  const [reactiveIsBlocking, setReactiveIsBlocking] = useState(globalIsBlocking)
  return {
    isBlocking: reactiveIsBlocking,
    blockNavigatingAway: () => {
      window.addEventListener('beforeunload', beforeUnloadHandler)
      setReactiveIsBlocking(true)
      globalIsBlocking = true
    },
    allowNavigatingAway: () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler)
      setReactiveIsBlocking(false)
      globalIsBlocking = false
    },
  }
}
