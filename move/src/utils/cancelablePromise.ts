export type CancelablePromise<T = void> = {
  promise: Promise<T>
  cancel: () => void
}

export const CANCELABLE_PROMISE_ABORT_SIGNAL_ERROR_MESSAGE = '__CANCELED__'

export function makeCancelablePromise<T>(
  executor: (resolve: (value: T) => void, reject: (reason?: Error) => void, signal: AbortSignal) => void
): CancelablePromise<T> {
  const controller = new AbortController()
  const signal = controller.signal

  const promise = new Promise<T>((resolve, reject) => {
    executor(resolve, reject, signal)

    signal.addEventListener('abort', () => {
      reject(new Error(CANCELABLE_PROMISE_ABORT_SIGNAL_ERROR_MESSAGE))
    })
  })

  return {
    promise: promise.catch(err => {
      if (err.message === CANCELABLE_PROMISE_ABORT_SIGNAL_ERROR_MESSAGE) {
        // Swallow the error if it's due to cancellation and return forever pending promise
        return new Promise(() => {})
      }
      throw err
    }),
    cancel: () => controller.abort(),
  }
}

export function cancelableTimeout(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve()
    }, ms)

    signal.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new Error(CANCELABLE_PROMISE_ABORT_SIGNAL_ERROR_MESSAGE))
    })
  })
}
