// MIT License https://github.com/expo/use-unmount-signal/blob/main/LICENSE
import { useEffect, useState } from 'react'

export class UnmountedAbortError extends Error {
  constructor() {
    super('UnmountedAbortError')
  }
}

/**
 * A React Hook that returns an AbortSignal that is marked as aborted when the calling component is
 * unmounted. This is useful for canceling promises, such as those for network requests, when a
 * component is unmounted.
 */
export function useUnmountSignal(): AbortSignal {
  const [abortController] = useState(() => new AbortController())

  useEffect(() => {
    return () => {
      abortController.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return abortController.signal
}
