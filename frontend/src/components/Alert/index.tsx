import { FC, PropsWithChildren, ReactElement } from 'react'
import classes from './index.module.css'
import { Card } from '../Card'
import { StringUtils } from '../../utils/string.utils'
import { LoadingIcon } from '../icons/LoadingIcon'
import { SuccessIcon } from '../icons/SuccessIcon'
import { ErrorIcon } from '../icons/ErrorIcon'

type AlertType = 'error' | 'success' | 'loading'

interface AlertTypeValues {
  header: string
  icon: ReactElement
}

const alertTypeValuesMap: Record<AlertType, AlertTypeValues> = {
  error: {
    header: 'Something went wrong',
    icon: <ErrorIcon width={106} height={106} />,
  },
  success: {
    header: 'Success',
    icon: <SuccessIcon width={106} height={106} />,
  },
  loading: {
    header: 'Loading',
    icon: <LoadingIcon />,
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
    <Card className={StringUtils.clsx(classes.card, className, alertTypeClassMap[type])}>
      <div className={classes.alert}>
        <h2>{headerText ?? header}</h2>
        <p className="body">{children}</p>
        <div className={classes.icon}>{icon}</div>
        <div className={classes.actions}>{actions}</div>
      </div>
    </Card>
  )
}
