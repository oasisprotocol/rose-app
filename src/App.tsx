import east_svg from '@material-design-icons/svg/filled/east.svg'
import classes from './App.module.css'

export function App() {
  return (
    <main className={classes.main}>
      <div className={classes.row}>
        <a href="/stake/" className={classes.stake}>
          <h2>Stake</h2>
          <p>A dApp that let's you stake ROSE on the Oasis Sapphire ParaTime.</p>
          <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
        </a>
        <a href="/move/" className={classes.move}>
          <h2>Move</h2>
          <p>
            Makes it easy to move ROSE tokens into Sapphire. It generates a Consensus account (oasis1*) that
            automatically forwards any received ROSE into your Sapphire account.
          </p>
          <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
        </a>
      </div>
    </main>
  )
}
