import east_svg from '@material-design-icons/svg/filled/east.svg'
import launch_svg from '@material-design-icons/svg/filled/launch.svg'
import classes from './App.module.css'

export function App() {
  return (
    <main className={classes.main}>
      <a href="https://wallet.oasis.io/" className={classes.transfer} target="_blank" rel="noopener noreferrer">
        <h2>Wallet</h2>
        <p>Official non-custodial wallet for the Oasis Consensus layer.</p>
        <img src={launch_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="/stake/" className={classes.stake}>
        <h2>Stake</h2>
        <p>A dApp that let's you stake ROSE on the Oasis Sapphire ParaTime.</p>
        <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="/move/" className={classes.move}>
        <h2>Move</h2>
        <p>
          Makes it easy to move ROSE tokens into Sapphire. It generates a Consensus account (oasis1*) that automatically
          forwards any received ROSE into your Sapphire account.
        </p>
        <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="https://wrose.oasis.io/" className={classes.wrap} target="_blank" rel="noopener noreferrer">
        <h2>Wrap</h2>
        <p>
          Quickly wrap your ROSE into wROSE (ERC&#8209;20) to use in supporting dApps. Also lets you unwrap so you can
          use it again on most exchanges.
        </p>
        <img src={launch_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a
        href="https://global.transak.com/?apiKey=4b66a274-d663-42a8-a495-e1f0e88ce023&productsAvailed=BUY&cryptoCurrencyCode=ROSE&disableWalletAddressForm=false&isFeeCalculationHidden=false&exchangeScreenTitle=Purchase+ROSE+to+your+wallet&themeColor=%2318213c&defaultFiatAmount=100"
        className={classes.buy}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>Buy on Transak</h2>
        <p>Convert your fiat currency into ROSE. This service is provided by Transak - an external party.</p>
        <img src={launch_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
    </main>
  )
}
