import east_svg from '@material-design-icons/svg/filled/east.svg'
import launch_svg from '@material-design-icons/svg/filled/launch.svg'
import classes from './App.module.css'

export function App() {
  return (
    <main className={classes.main}>
      <a href="https://wallet.oasis.io/" className={classes.transfer} target="_blank" rel="noopener noreferrer">
        <h2>Wallet</h2>
        <p>
          Cras turpis quam aliquam vestibulum lectus aenean tempor diam. Ultricies cras tincidunt sit hendrerit. Varius
          quisque pretium turpis lacus venenatis amet ac proin.
        </p>
        <img src={launch_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="/stake/" className={classes.stake}>
        <h2>Stake</h2>
        <p>
          Sed cursus placerat quam eleifend. Ultricies eleifend tellus ut massa. Commodo elementum scelerisque iaculis
          id.
        </p>
        <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="/move/" className={classes.move}>
        <h2>Move</h2>
        <p>
          Dui fringilla a dui nunc diam. Et elementum tincidunt neque tristique amet dictum. Pulvinar aenean nascetur
          lobortis aenean mauris semper pretium elementum risus.
        </p>
        <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="https://wrose.oasis.io/" className={classes.wrap} target="_blank" rel="noopener noreferrer">
        <h2>Wrap</h2>
        <p>
          Nunc eu pharetra sed ut. Vestibulum egestas ipsum mi mauris risus aenean eget faucibus. Porttitor risus risus
          mattis quis.
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
        <p>
          Aliquam sapien amet semper fermentum vel. Nec tincidunt in dolor id vitae. Ipsum mattis amet tristique
          maecenas in in scelerisque quis.
        </p>
        <img src={launch_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
    </main>
  )
}
