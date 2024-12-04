import { ReactElement, useState } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { SortOption } from '../../types'
import { ArrowDropDownIcon } from '../icons/ArrowDropDownIcon'
import { ArrowDropUpIcon } from '../icons/ArrowDropUpIcon'

interface Props<T> {
  headers?: string[]
  data: T[]
  className?: string
  children: (renderOptions: {
    entry: T
    index: number
    entries: T[]
    toggleRow: () => void
    isExpanded?: boolean | null
  }) => ReactElement
  isExpandable?: boolean
  maxHeight?: number | string
  sortByHeaders?: string[]
  sortBy?: (sortByHeader: string, direction: SortOption, data: T[]) => T[]
}

export const Table = <T extends object>({
  headers,
  data,
  className,
  children,
  isExpandable,
  maxHeight,
  sortByHeaders = [],
  sortBy,
}: Props<T>): ReactElement => {
  const [rows, setRows] = useState([...data])
  const [sortByOptions, setSortByOptions] = useState<{ header: string; direction: SortOption } | null>(null)

  const [isExpandedByIndex, setIsExpandedByIndex] = useState(() => {
    if (isExpandable) {
      return Array.from({ length: data.length }, () => false)
    }

    return null
  })

  const toggleRowByIndex = (rowIndex: number): void => {
    if (isExpandable === null) {
      return
    }

    setIsExpandedByIndex(prevState => {
      return (prevState ?? []).map((expanded, index) => (index === rowIndex ? !expanded : expanded))
    })
  }

  const handleSortBy = (header: string) => {
    if (!sortBy) {
      return
    }

    const currentHeader = sortByOptions?.header ?? null
    const currentDirection = sortByOptions?.direction ?? null

    const nextDirection =
      currentHeader === header ? ((Number(currentDirection) ?? 0) + 1) % 3 : SortOption.Down
    if (nextDirection === SortOption.Default) {
      setRows([...data])
      setSortByOptions(null)

      return
    }

    const sortedData = sortBy(header, nextDirection, [...data])
    setRows(sortedData)
    setSortByOptions({ header, direction: nextDirection })
  }

  return (
    <table className={StringUtils.clsx(classes.table, className)}>
      {!!headers?.length && (
        <thead>
          <tr>
            {headers.map((headerName, index) => (
              <th key={`${index}${headerName}`}>
                {headerName !== '' && (
                  <button
                    className={classes.sortBtn}
                    onClick={() => handleSortBy(headerName)}
                    disabled={!sortByHeaders.includes(headerName)}
                  >
                    {sortByOptions?.header === headerName && (
                      <>
                        {sortByOptions?.direction === SortOption.Down && <ArrowDropDownIcon />}
                        {sortByOptions?.direction === SortOption.Up && <ArrowDropUpIcon />}
                      </>
                    )}
                    <h3>{headerName}</h3>
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody
        style={{
          maxHeight: maxHeight ?? 'auto',
        }}
      >
        {rows.map((entry, index, entries) =>
          children({
            entry,
            entries,
            index,
            toggleRow: () => toggleRowByIndex(index),
            isExpanded: isExpandedByIndex?.[index] ?? null,
          })
        )}
      </tbody>
    </table>
  )
}
