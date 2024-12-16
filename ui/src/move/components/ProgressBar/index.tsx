import classes from './index.module.css'

interface ProgressBarProps {
  percentage: number
  isError?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, isError = false }) => {
  const isSuccess = !isError && percentage >= 1

  return (
    <div
      className={`${classes.progressbar} ${isError ? classes.isError : ''} ${isSuccess ? classes.isSuccess : ''}`}
    >
      <div className={classes.progressbarFill} style={{ width: `${percentage * 100}%` }} />
    </div>
  )
}
