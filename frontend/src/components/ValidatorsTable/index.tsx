import { FC, Fragment } from 'react'
import classes from './index.module.css'
import { Validator } from '@oasisprotocol/nexus-api'
import { useAppState } from '../../hooks/useAppState'
import { Table } from '../Table'
import { StringUtils } from '../../utils/string.utils'
import { ToggleButton } from '../ToggleButton'
import { ActiveIcon } from '../icons/ActiveIcon'
import { InactiveIcon } from '../icons/InactiveIcon'
import { Amount } from '../Amount'
import { NumberUtils } from '../../utils/number.utils'
import { LoadingTableData } from '../LoadingTableData'
import { EmptyTableData } from '../EmptyTableData'

interface Props {
  value: Validator | null
  onChange: (validator: Validator) => void
}

export const ValidatorsTable: FC<Props> = ({ value, onChange }) => {
  const {
    state: { validatorsList },
  } = useAppState()

  return (
    <div className={classes.validatorsTable}>
      {validatorsList === null && <LoadingTableData />}
      {validatorsList?.validators.length === 0 && (
        <EmptyTableData>
          <p>There are no validators available.</p>
        </EmptyTableData>
      )}
      {!!validatorsList?.validators.length && (
        <Table
          className={classes.table}
          headers={['', 'Name', 'Fee', '']}
          data={validatorsList.validators}
          isExpandable
          maxHeight={404}
        >
          {({ entry, isExpanded, toggleRow }) => {
            const isSelected = value?.entity_address === entry.entity_address
            return (
              <Fragment key={entry.entity_address}>
                <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined, classes.stakedRow)}>
                  <td>
                    <label className={classes.radioFormItem}>
                      &nbsp;
                      <input type="radio" checked={isSelected} onChange={() => onChange(entry)} />
                      <span className={classes.radioBtn}></span>
                    </label>
                  </td>
                  <td>
                    <p className={StringUtils.clsx('body', isSelected ? classes.bold : undefined)}>
                      {StringUtils.getValidatorFriendlyName(entry)}
                    </p>
                  </td>
                  <td>
                    <p className={StringUtils.clsx('body', isSelected ? classes.bold : undefined)}>
                      {NumberUtils.formatValidatorRate(entry.current_rate)}%
                    </p>
                  </td>
                  <td>
                    <ToggleButton isExpanded={!!isExpanded} toggleRow={toggleRow} />
                  </td>
                </tr>

                {isExpanded && (
                  <tr className={classes.expandedRow}>
                    <td colSpan={4}>
                      <div className={classes.validatorDetails}>
                        <p className="body">
                          <span>Status:</span>
                          <span>
                            {entry.active ? (
                              <>
                                Active&nbsp;&nbsp;
                                <ActiveIcon />
                              </>
                            ) : (
                              <>
                                Inactive&nbsp;&nbsp;
                                <InactiveIcon />
                              </>
                            )}
                          </span>
                        </p>
                        <p className="body">
                          <span>Rank:</span>
                          <span>{entry.rank ? `#${entry.rank}` : '-'}</span>
                        </p>
                        <p className="body">
                          <span>Active escrow:</span>
                          <span>
                            <Amount unit="consensus" amount={entry.escrow.active_balance ?? 0n} />
                          </span>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          }}
        </Table>
      )}
    </div>
  )
}
