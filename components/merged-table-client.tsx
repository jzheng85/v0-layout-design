"use client"

import { cn } from "@/lib/utils"
import { MergedTable } from "./merged-table"
import { CircularProgress } from "./circular-progress"

export interface SampleData {
  department: string
  team: string
  employee: string
  role: string
  status: string
  progress: number
}

interface MergedTableClientProps {
  data: SampleData[]
}

export function MergedTableClient({ data }: MergedTableClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">员工信息表</h3>
        <MergedTable
          data={data}
          columns={[
            {
              key: "department",
              header: "部门",
              merge: true,
              filterable: true,
              sortable: true,
              className: "font-medium",
              defaultVisible: true,
            },
            {
              key: "team",
              header: "团队",
              merge: true,
              filterable: true,
              sortable: true,
              defaultVisible: true,
            },
            {
              key: "employee",
              header: "员工姓名",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: true,
            },
            {
              key: "role",
              header: "职位",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
            },
            {
              key: "status",
              header: "状态",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: true,
              render: (value) => (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                    value === "在职" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500",
                  )}
                >
                  {value}
                </span>
              ),
            },
            {
              key: "progress",
              header: "完成度",
              merge: false,
              sortable: true,
              defaultVisible: true,
              render: (value) => <CircularProgress value={value as number} />,
            },
          ]}
        />
      </div>
    </div>
  )
}
