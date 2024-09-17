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
  maxHeight?: number | string
}

export const Table = <T extends object>({
  headers,
  data,
  className,
  children,
  isExpandable,
  maxHeight,
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
            {headers.map((headerName, index) => (
              <th key={`${index}${headerName}`}>{headerName !== '' && <h3>{headerName}</h3>}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody
        style={{
          maxHeight: maxHeight ?? 'auto',
        }}
      >
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
