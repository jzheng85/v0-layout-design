"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { MoreVertical, ArrowUp, ArrowDown, X, Columns3, GripVertical, ChevronUp, ChevronDown } from "lucide-react"

interface MergedTableColumn<T> {
  key: keyof T
  header: string
  merge?: boolean
  filterable?: boolean
  sortable?: boolean
  defaultVisible?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

interface MergedTableProps<T> {
  data: T[]
  columns: MergedTableColumn<T>[]
  className?: string
}

interface CellSpan {
  rowSpan: number
  skip: boolean
}

type SortDirection = "asc" | "desc" | null

export function MergedTable<T extends Record<string, any>>({ data, columns, className }: MergedTableProps<T>) {
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof T | null; direction: SortDirection }>({
    key: null,
    direction: null,
  })
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    columns.forEach((col) => {
      initial[String(col.key)] = col.defaultVisible !== false
    })
    return initial
  })
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map((col) => String(col.key)))
  const [globalSearch, setGlobalSearch] = React.useState<string>("")

  const displayColumns = React.useMemo(() => {
    return columnOrder
      .map((key) => columns.find((col) => String(col.key) === key))
      .filter((col): col is MergedTableColumn<T> => col !== undefined && visibleColumns[String(col.key)])
  }, [columns, visibleColumns, columnOrder])

  const sortedAndFilteredData = React.useMemo(() => {
    let processedData = [...data]

    if (sortConfig.key && sortConfig.direction) {
      processedData.sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()

        if (sortConfig.direction === "asc") {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }

    // Apply column filters
    processedData = processedData.filter((row) => {
      return columns.every((column) => {
        const filterValue = filters[String(column.key)]
        if (!filterValue || !column.filterable) return true

        const cellValue = String(row[column.key]).toLowerCase()
        return cellValue.includes(filterValue.toLowerCase())
      })
    })

    // Apply global search
    if (globalSearch) {
      const searchTerm = globalSearch.toLowerCase()
      processedData = processedData.filter((row) => {
        return displayColumns.some((column) => {
          const cellValue = String(row[column.key]).toLowerCase()
          return cellValue.includes(searchTerm)
        })
      })
    }

    return processedData
  }, [data, filters, columns, sortConfig, globalSearch, displayColumns])

  const calculateMerges = React.useMemo(() => {
    const mergeMap: Record<string, CellSpan[]> = {}

    displayColumns.forEach((column) => {
      if (!column.merge) {
        mergeMap[String(column.key)] = sortedAndFilteredData.map(() => ({
          rowSpan: 1,
          skip: false,
        }))
        return
      }

      const spans: CellSpan[] = []
      let i = 0

      while (i < sortedAndFilteredData.length) {
        const currentValue = sortedAndFilteredData[i][column.key]
        let rowSpan = 1

        while (
          i + rowSpan < sortedAndFilteredData.length &&
          sortedAndFilteredData[i + rowSpan][column.key] === currentValue
        ) {
          rowSpan++
        }

        spans.push({ rowSpan, skip: false })

        for (let j = 1; j < rowSpan; j++) {
          spans.push({ rowSpan: 1, skip: true })
        }

        i += rowSpan
      }

      mergeMap[String(column.key)] = spans
    })

    return mergeMap
  }, [sortedAndFilteredData, displayColumns])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSort = (key: keyof T, direction: SortDirection) => {
    setSortConfig({ key, direction })
    setOpenDropdown(null)
  }

  const handleClearSort = (columnKey: keyof T) => {
    if (sortConfig.key === columnKey) {
      setSortConfig({ key: null, direction: null })
    }
    setOpenDropdown(null)
  }

  const handleClearFilter = (key: string) => {
    setFilters((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const moveColumnUp = (key: string) => {
    setColumnOrder((prev) => {
      const index = prev.indexOf(key)
      if (index <= 0) return prev
      const newOrder = [...prev]
      ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
      return newOrder
    })
  }

  const moveColumnDown = (key: string) => {
    setColumnOrder((prev) => {
      const index = prev.indexOf(key)
      if (index === -1 || index >= prev.length - 1) return prev
      const newOrder = [...prev]
      ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
      return newOrder
    })
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <Input
          placeholder="Filter by title or ID..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="w-64"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Columns3 className="h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">Manage columns</div>
            <DropdownMenuSeparator />
            {columnOrder.map((key, index) => {
              const column = columns.find((col) => String(col.key) === key)
              if (!column) return null

              return (
                <div key={key} className="flex items-center gap-1 px-2 py-1.5 hover:bg-accent rounded-sm group">
                  <div className="flex flex-col gap-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-4 p-0 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => moveColumnUp(key)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-3 w-4 p-0 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => moveColumnDown(key)}
                      disabled={index === columnOrder.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns[key]}
                    onCheckedChange={() => toggleColumnVisibility(key)}
                    className="flex-1"
                  >
                    {column.header}
                  </DropdownMenuCheckboxItem>
                </div>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              {displayColumns.map((column) => {
                const hasFeatures = column.sortable || column.filterable
                const isFiltered = filters[String(column.key)]
                const isSorted = sortConfig.key === column.key

                return (
                  <TableHead
                    key={String(column.key)}
                    className={cn(column.className, "font-bold text-foreground py-1")}
                  >
                    <div className="flex items-center justify-between gap-1 h-full">
                      <span className="font-semibold">{column.header}</span>
                      {hasFeatures && (
                        <DropdownMenu
                          open={openDropdown === String(column.key)}
                          onOpenChange={(open) => setOpenDropdown(open ? String(column.key) : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn("h-6 w-6 p-0 hover:bg-muted", (isFiltered || isSorted) && "text-primary")}
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            {column.sortable && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleSort(column.key, "asc")}
                                  className={cn(
                                    "cursor-pointer",
                                    sortConfig.key === column.key && sortConfig.direction === "asc" && "bg-accent",
                                  )}
                                >
                                  <ArrowUp className="mr-2 h-4 w-4" />
                                  Sort Ascending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleSort(column.key, "desc")}
                                  className={cn(
                                    "cursor-pointer",
                                    sortConfig.key === column.key && sortConfig.direction === "desc" && "bg-accent",
                                  )}
                                >
                                  <ArrowDown className="mr-2 h-4 w-4" />
                                  Sort Descending
                                </DropdownMenuItem>
                                {isSorted && (
                                  <DropdownMenuItem
                                    onClick={() => handleClearSort(column.key)}
                                    className="cursor-pointer"
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Clear Sort
                                  </DropdownMenuItem>
                                )}
                                {column.filterable && <DropdownMenuSeparator />}
                              </>
                            )}
                            {column.filterable && (
                              <div className="p-2">
                                <div className="flex items-center gap-2">
                                  <Input
                                    placeholder="Filter..."
                                    value={filters[String(column.key)] || ""}
                                    onChange={(e) => handleFilterChange(String(column.key), e.target.value)}
                                    className="h-8"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  {isFiltered && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleClearFilter(String(column.key))
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayColumns.length} className="text-center text-muted-foreground py-8">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              sortedAndFilteredData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-transparent">
                  {displayColumns.map((column) => {
                    const cellSpan = calculateMerges[String(column.key)][rowIndex]

                    if (cellSpan.skip) {
                      return null
                    }

                    const value = row[column.key]
                    const content = column.render ? column.render(value, row) : String(value)

                    return (
                      <TableCell
                        key={String(column.key)}
                        rowSpan={cellSpan.rowSpan}
                        className={cn(
                          column.className,
                          cellSpan.rowSpan > 1 && "align-middle border-r last:border-r-0",
                          "transition-colors hover:bg-muted/50",
                        )}
                      >
                        {content}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}