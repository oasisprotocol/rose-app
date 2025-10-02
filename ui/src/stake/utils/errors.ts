export const toErrorString = (error: Error = new Error('Unknown error')) => {
  if ('message' in error) return error?.message
  if (typeof error === 'object') return JSON.stringify(error)
  return error
}
