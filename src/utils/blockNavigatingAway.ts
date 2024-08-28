const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  // Included for legacy support, e.g. Chrome/Edge < 119
  event.returnValue = true
}
export const blockNavigatingAway = () => window.addEventListener('beforeunload', beforeUnloadHandler)
export const allowNavigatingAway = () => window.removeEventListener('beforeunload', beforeUnloadHandler)
