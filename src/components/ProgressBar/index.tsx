import classes from './index.module.css'

interface ProgressBarProps {
  percentage: number;
  error?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, error = false  }) => {
  let progressColor = error ? '#f44336' : '#000062';
  let progressBorder = error ? '1px solid #f44336' : 'none';

  if (!error && percentage >= 1) {
    progressColor = '#21B062';
  }

  return (
    <div className={classes.progressbar} style={{ border: progressBorder }}>
      <div
        className={classes.progressbarfill}
        style={{ width: `${percentage * 100}%`, backgroundColor: progressColor }}
      />
    </div>
  );
};

export default ProgressBar;