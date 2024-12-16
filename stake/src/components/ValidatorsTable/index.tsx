import { FC, Fragment } from 'react'
import classes from './index.module.css'
import { Validator } from '@oasisprotocol/nexus-api'
import { useAppState } from '../../hooks/useAppState'
import {
  ActiveIcon,
  Amount,
  EmptyTableData,
  InactiveIcon,
  LoadingTableData,
  NumberUtils,
  SortOption,
  StringUtils,
  Table,
  ToggleButton,
} from '@oasisprotocol/rose-app-ui/stake'

interface Props {
  value: Validator | null
  onChange: (validator: Validator) => void
}

export const ValidatorsTable: FC<Props> = ({ value, onChange }) => {
  const {
    state: { validatorsList, isMobileScreen, isDesktopScreen },
  } = useAppState()

  const handleSortBy = (sortByHeader: string, direction: SortOption, data: Validator[]): Validator[] => {
    if (!data.length) {
      return []
    }

    if (sortByHeader === 'Commission') {
      return data.sort(({ current_rate: currentRateA }, { current_rate: currentRateB }) =>
        direction === SortOption.Down ? currentRateB - currentRateA : currentRateA - currentRateB
      )
    }

    if (sortByHeader === 'Name') {
      return data.sort((validatorA, validatorB) =>
        direction === SortOption.Down
          ? StringUtils.getValidatorFriendlyName(validatorB).localeCompare(
              StringUtils.getValidatorFriendlyName(validatorA)
            )
          : StringUtils.getValidatorFriendlyName(validatorA).localeCompare(
              StringUtils.getValidatorFriendlyName(validatorB)
            )
      )
    }

    return []
  }

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
          headers={['', 'Name', 'Commission', '']}
          data={validatorsList.validators}
          isExpandable
          maxHeight={328}
          sortByHeaders={['Name', 'Commission']}
          sortBy={handleSortBy}
        >
          {({ entry, isExpanded, toggleRow }) => {
            const isSelected = value?.entity_address === entry.entity_address
            return (
              <Fragment key={entry.entity_address}>
                <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined)}>
                  <td>
                    <label className={classes.radioFormItem}>
                      &nbsp;
                      <input type="radio" checked={isSelected} onChange={() => onChange(entry)} />
                      <span className={classes.radioBtn}></span>
                    </label>
                  </td>
                  <td>
                    <p
                      className={StringUtils.clsx('body', 'ellipsis', isSelected ? classes.bold : undefined)}
                    >
                      {isMobileScreen && (
                        <span className="mono">{StringUtils.getValidatorFriendlyName(entry)}</span>
                      )}
                      {isDesktopScreen && (
                        <span className="mono">{StringUtils.getValidatorFriendlyName(entry)}</span>
                      )}
                      {isDesktopScreen && !entry.active && (
                        <>
                          &nbsp;
                          <span className="body mute">(inactive)</span>
                        </>
                      )}
                    </p>
                    {isMobileScreen && !entry.active && (
                      <p className="body mute">
                        <span>(inactive)</span>
                      </p>
                    )}
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
                          <span className={classes.validatorDetailsActiveEscrowAmount}>
                            <Amount unit="consensus" amount={entry.escrow.active_balance ?? 0n} />
                          </span>
                        </p>
                        <p className="body">
                          <span>Commission:</span>
                          <span>{NumberUtils.formatValidatorRate(entry.current_rate)}%</span>
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
