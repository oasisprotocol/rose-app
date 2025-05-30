import { expect, test } from 'vitest'
import { MAX_GAS_LIMIT } from '../../constants/config'
import { NumberUtils } from '../../../../ui/src/stake/utils/number.utils'
import { parseEther, parseUnits } from 'viem'

const { shouldShowFeeWarningModal } = NumberUtils

const gasPrice = parseUnits('100', 18)
const fee = gasPrice * MAX_GAS_LIMIT

test.skip('should show modal if user can not afford future transactions', () => {
  const amount = parseEther('9.99')
  const accountBalanceAmount = parseEther('10')
  const show = shouldShowFeeWarningModal({ fee, amount, accountBalanceAmount })

  expect(show).toEqual(true)
})

test('should skip modal if user can not afford to retain fees for future transactions', () => {
  const amount = parseEther('0.02')
  const accountBalanceAmount = parseEther('0.02')
  const show = shouldShowFeeWarningModal({ fee, amount, accountBalanceAmount })

  expect(show).toEqual(false)
})

test('should skip modal if user can already afford future transactions', () => {
  const amount = parseEther('20')
  const accountBalanceAmount = parseEther('40')

  const show = shouldShowFeeWarningModal({ fee, amount, accountBalanceAmount })

  expect(show).toEqual(false)
})

test('should skip modal in case tiny amounts are used', () => {
  const amount = parseEther('0.02')
  const accountBalanceAmount = parseEther('10')
  const show = shouldShowFeeWarningModal({ fee, amount, accountBalanceAmount })

  expect(show).toEqual(false)
})
