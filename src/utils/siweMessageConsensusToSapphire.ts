if (import.meta.env.BASE_URL !== window.location.pathname) {
  // Don't allow typos in pathname like https://oasisprotocol.github.io/dapp-onramp/abc or https://oasisprotocol.github.io/dapp-onramp//
  // (it would derive a different account that is hard to reproduce)
  throw new Error('Wrong URL')
}

/**
 * https://docs.metamask.io/wallet/how-to/sign-data/siwe/
 * https://eips.ethereum.org/EIPS/eip-4361
 */
export function siweMessageConsensusToSapphire(address: `0x${string}`) {
  const statement =
    'Signing this message will generate an Oasis Consensus account, ' +
    "please don't sign this message on any other site"
  const issuedAt = '2000-01-01T00:00:01Z'
  return (
    // biome-ignore lint/style/useTemplate: more readable than single line template string
    `${window.location.host} wants you to sign in with your Ethereum account:\n` +
    `${address}\n` +
    `\n` +
    `${statement}\n` +
    `\n` +
    `URI: ${window.location.origin + window.location.pathname}\n` + // Search params shouldn't affect derivation
    `Version: 1\n` + // Must be 1
    `Chain ID: 23294\n` + // Sapphire Mainnet
    `Nonce: noReplayProtection\n` + // All fields must be constant to always derive the same account
    `Issued At: ${issuedAt}`
  )
}
