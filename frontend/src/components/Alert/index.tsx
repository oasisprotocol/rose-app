import { FC, PropsWithChildren, ReactElement } from 'react'
import classes from './index.module.css'
import { Card } from '../Card'
import { WarningIcon } from '../icons/WarningIcon'
import { CheckCircleIcon } from '../icons/CheckCircleIcon'
import { SpinnerIcon } from '../icons/SpinnerIcon'
import { StringUtils } from '../../utils/string.utils'

type AlertType = 'error' | 'success' | 'loading'

interface AlertTypeValues {
  header: string
  icon: ReactElement
}

const alertTypeValuesMap: Record<AlertType, AlertTypeValues> = {
  error: {
    header: 'Something went wrong',
    icon: <WarningIcon />,
  },
  success: {
    header: 'Success',
    icon: <CheckCircleIcon size="xlarge" />,
  },
  loading: {
    header: 'Loading',
    icon: <SpinnerIcon />,
  },
}

const alertTypeClassMap: Record<AlertType, string> = {
  error: classes.alertError,
  success: classes.alertSuccess,
  loading: classes.alertLoading,
}

interface Props extends PropsWithChildren {
  type: AlertType
  actions?: ReactElement
  headerText?: string
  className?: string
}

export const Alert: FC<Props> = ({ children, className, type, actions, headerText }) => {
  const { header, icon } = alertTypeValuesMap[type]

  return (
    <Card className={StringUtils.clsx(className, alertTypeClassMap[type])}>
      <div className={classes.alert}>
        <h2>{headerText ?? header}</h2>
        <p>{children}</p>
        <div className={classes.icon}>{icon}</div>
        <div className={classes.actions}>{actions}</div>
      </div>
    </Card>
  )
}
