export function OpenTransak(props: {
  consensusAddress: `oasis1${string}`
}) {
  const REACT_APP_TRANSAK_URL = 'https://global.transak.com'
  const REACT_APP_TRANSAK_PARTNER_ID = '4b66a274-d663-42a8-a495-e1f0e88ce023'

  const transakUrl = `${REACT_APP_TRANSAK_URL}/?${new URLSearchParams({
    // https://docs.transak.com/docs/query-parameters
    apiKey: REACT_APP_TRANSAK_PARTNER_ID,
    productsAvailed: 'BUY',
    cryptoCurrencyCode: 'ROSE',
    walletAddress: props.consensusAddress,
    disableWalletAddressForm: 'true',
    isFeeCalculationHidden: 'false',
    exchangeScreenTitle: 'Buy ROSE into generated address',
    themeColor: '0500e2',
  }).toString()}`

  return (
    <a href={transakUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--white)' }}>
      Buy ROSE using Transak
    </a>
  )
}
