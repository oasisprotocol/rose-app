import { BaseError } from 'viem'

export const toErrorString = (error: Error | BaseError = new Error('Unknown error')) => {
  if ('shortMessage' in error) return error?.shortMessage
  if ('message' in error) return error?.message
  if (typeof error === 'object') return JSON.stringify(error)
  return error
}
