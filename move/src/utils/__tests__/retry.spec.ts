import { expect, test, vi } from 'vitest'
import { retry } from '../retry'

test('should retry promise until it resolves', async () => {
  const promiseFunc = vi
    .fn()
    .mockRejectedValueOnce(new Error('Promise fail'))
    .mockRejectedValueOnce(new Error('Promise fail'))
    .mockResolvedValueOnce('Promise success')

  const resolvedValue = await retry(promiseFunc, val => val, 3, 0)

  expect(resolvedValue).toBe('Promise success')
  expect(promiseFunc).toHaveBeenCalledTimes(3)
})

test('should not retry promise if resolves', async () => {
  const promiseFunc = vi.fn().mockResolvedValueOnce('Promise success')

  const resolvedValue = await retry(promiseFunc, val => val, 3, 0)

  expect(resolvedValue).toBe('Promise success')
  expect(promiseFunc).toHaveBeenCalledTimes(1)
})

test('should return a rejected promise if maximum attempts exceeded', async () => {
  const promiseFunc = vi.fn().mockRejectedValue(new Error('Promise fail'))

  const rejectedPromise = retry(promiseFunc, val => val, 3, 0)

  await expect(rejectedPromise).rejects.toThrow('Promise fail')
  expect(promiseFunc).toHaveBeenCalledTimes(3)
})
