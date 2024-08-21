import { NETWORK_NAMES } from '../constants/config'
import { Validator } from '@oasisprotocol/nexus-api'

const truncateEthRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
const truncateOasisRegex = /^(oasis1[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
export const amountPattern = '^[0-9]*[.]?[0-9]*$'

export abstract class StringUtils {
  static truncateAddress = (address: string, type: 'eth' | 'oasis' = 'eth') => {
    const matches = address.match(type === 'oasis' ? truncateOasisRegex : truncateEthRegex)
    if (!matches || matches?.length <= 0) return address

    const [, start, end] = matches
    return `${start}\u2026${end}`
  }

  static getTransactionUrl = (baseUrl: string, txHash: string) => `${baseUrl}/tx/${txHash}`

  static getAccountUrl = (baseUrl: string, address: string) => `${baseUrl}/address/${address}`

  static clsx = (...classNames: (string | undefined)[]) => {
    return classNames
      .map(className => (className ? [className] : []))
      .flat()
      .join(' ')
  }

  static getNetworkFriendlyName = (chainName: string) => {
    return NETWORK_NAMES[chainName] ?? 'Unknown network'
  }

  static truncate = (s: string, sliceIndex = 200) => {
    return s.slice(0, sliceIndex)
  }

  static getValidatorFriendlyName = (validator?: Validator) => {
    if (!validator) {
      return 'Unknown'
    }

    if (validator.media?.name) {
      return validator.media.name
    }

    return StringUtils.truncateAddress(validator.entity_address, 'oasis')
  }

  static getValidatorName = (validator?: Validator) => {
    if (!validator) {
      return 'Unknown'
    }

    if (validator.media?.name) {
      return validator.media.name
    }

    return null
  }

  static getValidatorFriendlyAddress = (validator?: Validator) => {
    if (!validator) {
      return 'Unknown'
    }

    if (validator.entity_address) {
      return StringUtils.truncateAddress(validator.entity_address, 'oasis')
    }

    return null
  }
}
