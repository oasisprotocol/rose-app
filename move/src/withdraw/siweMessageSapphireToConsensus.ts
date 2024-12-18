/**
 * https://docs.metamask.io/wallet/how-to/sign-data/siwe/
 * https://eips.ethereum.org/EIPS/eip-4361
 */
export function siweMessageSapphireToConsensus(address: `0x${string}`) {
  const statement =
    'Signing this message will generate your unique Oasis Sapphire and Consensus accounts. ' +
    "Please, don't sign this message on any other site."
  const issuedAt = '2000-01-01T00:00:01Z'
  return (
    `rose.oasis.io wants you to sign in with your Ethereum account:\n` +
    `${address}\n` +
    `\n` +
    `${statement}\n` +
    `\n` +
    `URI: https://rose.oasis.io\n` + // Path and search params shouldn't affect derivation
    `Version: 1\n` + // Must be 1
    `Chain ID: 23294\n` + // Sapphire Mainnet
    `Nonce: noReplayProtection\n` + // All fields must be constant to always derive the same account
    `Issued At: ${issuedAt}`
  )
}
