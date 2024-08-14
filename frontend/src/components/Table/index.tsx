import { ReactElement, useState } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'

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
}

export const Table = <T extends object>({
  headers,
  data,
  className,
  children,
  isExpandable,
}: Props<T>): ReactElement => {
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

  return (
    <table className={StringUtils.clsx(classes.table, className)}>
      {!!headers?.length && (
        <thead>
          <tr>
            {headers.map(headerName => (
              <th key={headerName}>{headerName}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {data.map((entry, index, entries) =>
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
