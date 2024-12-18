import east_svg from '@material-design-icons/svg/filled/east.svg'
import { NavLink } from 'react-router-dom'
import classes from './App.module.css'

export function App() {
  return (
    <main className={classes.main}>
      <div className={classes.row}>
        <NavLink to="/stake" className={classes.stake}>
          <h2>Stake</h2>
          <p>Stake your ROSE directly from Sapphire using an EVM compatible wallet.</p>
          <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
        </NavLink>
        <NavLink to="/move" className={classes.move}>
          <h2>Move</h2>
          <p>Move your ROSE between any crypto exchange or consensus account and Sapphire.</p>
          <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
        </NavLink>
      </div>
    </main>
  )
}
