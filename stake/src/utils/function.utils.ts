export abstract class FunctionUtils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number,
    { leading }: { leading?: boolean } = {}
  ) => {
    let timerId: ReturnType<typeof setTimeout>

    return (...args: Parameters<T>) => {
      if (!timerId && leading) {
        func(...args)
      }
      clearTimeout(timerId)

      timerId = setTimeout(() => func(...args), delay)
    }
  }
}
