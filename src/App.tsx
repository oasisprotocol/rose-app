import east_svg from '@material-design-icons/svg/filled/east.svg'
import classes from './App.module.css'

export function App() {
  return (
    <main className={classes.main}>
      <a href="/stake/">
        <h2>Stake</h2>
        <p>
          Sed cursus placerat quam eleifend. Ultricies eleifend tellus ut massa. Commodo elementum scelerisque iaculis
          id.
        </p>
        <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
      <a href="/move/">
        <h2>Move</h2>
        <p>
          Dui fringilla a dui nunc diam. Et elementum tincidunt neque tristique amet dictum. Pulvinar aenean nascetur
          lobortis aenean mauris semper pretium elementum risus.
        </p>
        <img src={east_svg} alt="Go" width="24" style={{ filter: 'invert(1)' }} />
      </a>
    </main>
  )
}
