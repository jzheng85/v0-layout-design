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
import {
  MoreVertical,
  ArrowUp,
  ArrowDown,
  X,
  Columns3,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react"

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

interface SortConfig<T> {
  key: keyof T
  direction: "asc" | "desc"
  priority: number
}

export function MergedTable<T extends Record<string, any>>({ data, columns, className }: MergedTableProps<T>) {
  const [filters, setFilters] = React.useState<Record<string, string>>({})
  const [sortConfigs, setSortConfigs] = React.useState<SortConfig<T>[]>([])
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const [globalSearch, setGlobalSearch] = React.useState("")
  const [visibleColumns, setVisibleColumns] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    columns.forEach((col) => {
      initial[String(col.key)] = col.defaultVisible !== false
    })
    return initial
  })
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() => columns.map((col) => String(col.key)))

  const displayColumns = React.useMemo(() => {
    return columnOrder
      .map((key) => columns.find((col) => String(col.key) === key))
      .filter((col): col is MergedTableColumn<T> => col !== undefined && visibleColumns[String(col.key)])
  }, [columns, visibleColumns, columnOrder])

  const sortedAndFilteredData = React.useMemo(() => {
    let processedData = [...data]

    if (sortConfigs.length > 0) {
      processedData.sort((a, b) => {
        for (const config of sortConfigs) {
          const aValue = a[config.key]
          const bValue = b[config.key]

          if (aValue === null || aValue === undefined) return 1
          if (bValue === null || bValue === undefined) return -1

          let comparison = 0
          if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue
          } else {
            const aStr = String(aValue).toLowerCase()
            const bStr = String(bValue).toLowerCase()
            comparison = aStr.localeCompare(bStr)
          }

          if (comparison !== 0) {
            return config.direction === "asc" ? comparison : -comparison
          }
        }
        return 0
      })
    }

    processedData = processedData.filter((row) => {
      return columns.every((column) => {
        const filterValue = filters[String(column.key)]
        if (!filterValue || !column.filterable) return true

        const cellValue = String(row[column.key]).toLowerCase()
        return cellValue.includes(filterValue.toLowerCase())
      })
    })

    if (globalSearch) {
      processedData = processedData.filter((row) => {
        return columns.some((column) => {
          const cellValue = String(row[column.key]).toLowerCase()
          return cellValue.includes(globalSearch.toLowerCase())
        })
      })
    }

    return processedData
  }, [data, filters, columns, sortConfigs, globalSearch])

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

  const handleSort = (key: keyof T, direction: "asc" | "desc") => {
    setSortConfigs((prev) => {
      const existingIndex = prev.findIndex((config) => config.key === key)

      if (existingIndex >= 0) {
        // Update existing sort
        const updated = [...prev]
        updated[existingIndex] = { key, direction, priority: updated[existingIndex].priority }
        return updated
      } else {
        // Add new sort with lowest priority (highest number)
        const maxPriority = prev.length > 0 ? Math.max(...prev.map((c) => c.priority)) : -1
        return [...prev, { key, direction, priority: maxPriority + 1 }]
      }
    })
    setOpenDropdown(null)
  }

  const handleClearSort = (columnKey: keyof T) => {
    setSortConfigs((prev) => prev.filter((config) => config.key !== columnKey))
    setOpenDropdown(null)
  }

  const handleClearAllSorts = () => {
    setSortConfigs([])
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

  const getSortInfo = (key: keyof T) => {
    const sortConfig = sortConfigs.find((config) => config.key === key)
    return sortConfig
  }

  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      <div className="flex items-center justify-between gap-4 p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索表格内容..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="h-9"
          />
          {globalSearch && (
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setGlobalSearch("")}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {sortConfigs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>已排序: {sortConfigs.length}</span>
              <Button variant="ghost" size="sm" onClick={handleClearAllSorts} className="h-8">
                清除排序
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 bg-transparent">
                <Columns3 className="h-4 w-4 mr-2" />
                列设置
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-semibold">管理列</div>
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
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b-2">
            {displayColumns.map((column) => {
              const hasFeatures = column.sortable || column.filterable
              const isFiltered = filters[String(column.key)]
              const sortInfo = getSortInfo(column.key)

              return (
                <TableHead
                  key={String(column.key)}
                  className={cn(column.className, "bg-muted/50 font-bold text-foreground h-14")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{column.header}</span>
                      {sortInfo && (
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {sortInfo.priority + 1}
                        </span>
                      )}
                    </div>
                    {hasFeatures && (
                      <DropdownMenu
                        open={openDropdown === String(column.key)}
                        onOpenChange={(open) => setOpenDropdown(open ? String(column.key) : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn("h-7 w-7 p-0 hover:bg-muted", (isFiltered || sortInfo) && "text-primary")}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                          {column.sortable && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleSort(column.key, "asc")}
                                className={cn("cursor-pointer", sortInfo?.direction === "asc" && "bg-accent")}
                              >
                                <ArrowUp className="mr-2 h-4 w-4" />
                                升序排列
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSort(column.key, "desc")}
                                className={cn("cursor-pointer", sortInfo?.direction === "desc" && "bg-accent")}
                              >
                                <ArrowDown className="mr-2 h-4 w-4" />
                                降序排列
                              </DropdownMenuItem>
                              {sortInfo && (
                                <DropdownMenuItem
                                  onClick={() => handleClearSort(column.key)}
                                  className="cursor-pointer"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  清除此列排序
                                </DropdownMenuItem>
                              )}
                              {column.filterable && <DropdownMenuSeparator />}
                            </>
                          )}
                          {column.filterable && (
                            <div className="p-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="筛选..."
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
                没有找到匹配的数据
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

                  const isLastRowOfSpan =
                    rowIndex + cellSpan.rowSpan === sortedAndFilteredData.length ||
                    rowIndex + cellSpan.rowSpan < sortedAndFilteredData.length
                  const showBottomBorder = rowIndex + cellSpan.rowSpan < sortedAndFilteredData.length

                  return (
                    <TableCell
                      key={String(column.key)}
                      rowSpan={cellSpan.rowSpan}
                      className={cn(
                        column.className,
                        "align-middle transition-colors hover:bg-muted/50",
                        "border-r last:border-r-0",
                        showBottomBorder && "border-b",
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
  )
}
