"use client"

import { cn } from "@/lib/utils"
import { MergedTable } from "./merged-table"
import { CircularProgress } from "./circular-progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"

interface SampleData {
  department: string
  team: string
  employee: string
  role: string
  status: string
  progress: number
}

const sampleData: SampleData[] = [
  {
    department: "技术部",
    team: "前端团队",
    employee: "张三",
    role: "高级工程师",
    status: "在职",
    progress: 85,
  },
  {
    department: "技术部",
    team: "前端团队",
    employee: "李四",
    role: "工程师",
    status: "在职",
    progress: 92,
  },
  {
    department: "技术部",
    team: "后端团队",
    employee: "王五",
    role: "架构师",
    status: "在职",
    progress: 78,
  },
  {
    department: "技术部",
    team: "后端团队",
    employee: "赵六",
    role: "工程师",
    status: "在职",
    progress: 65,
  },
  {
    department: "市场部",
    team: "品牌团队",
    employee: "孙七",
    role: "经理",
    status: "在职",
    progress: 45,
  },
  {
    department: "市场部",
    team: "品牌团队",
    employee: "周八",
    role: "专员",
    status: "休假",
    progress: 28,
  },
]

interface TeamDetails {
  teamName: string
  department: string
  manager: string
  memberCount: number
  avgProgress: number
  projects: string[]
  description: string
}

const teamDetailsMap: Record<string, TeamDetails> = {
  前端团队: {
    teamName: "前端团队",
    department: "技术部",
    manager: "张三",
    memberCount: 2,
    avgProgress: 88.5,
    projects: ["电商平台", "管理系统", "移动应用"],
    description: "负责公司所有前端项目的开发与维护，使用React、Vue等现代框架。",
  },
  后端团队: {
    teamName: "后端团队",
    department: "技术部",
    manager: "王五",
    memberCount: 2,
    avgProgress: 71.5,
    projects: ["API网关", "微服务架构", "数据库优化"],
    description: "负责后端服务开发，包括API设计、数据库管理和系统架构优化。",
  },
  品牌团队: {
    teamName: "品牌团队",
    department: "市场部",
    manager: "孙七",
    memberCount: 2,
    avgProgress: 36.5,
    projects: ["品牌推广", "社交媒体运营", "内容营销"],
    description: "负责公司品牌建设、市场推广和社交媒体运营。",
  },
}

export function MergedTableDemo() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName)
    setIsDialogOpen(true)
  }

  const teamDetails = selectedTeam ? teamDetailsMap[selectedTeam] : null

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">员工信息表</h3>
        <MergedTable
          data={sampleData}
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
              render: (value) => (
                <button
                  onClick={() => handleTeamClick(value as string)}
                  className="text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  {value}
                </button>
              ),
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{teamDetails?.teamName}</DialogTitle>
            <DialogDescription>{teamDetails?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">部门</p>
                <p className="font-medium">{teamDetails?.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">团队负责人</p>
                <p className="font-medium">{teamDetails?.manager}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">团队人数</p>
                <p className="font-medium">{teamDetails?.memberCount} 人</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">平均完成度</p>
                <div className="flex items-center gap-2">
                  <CircularProgress value={teamDetails?.avgProgress || 0} size={32} />
                  <span className="font-medium">{teamDetails?.avgProgress}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">进行中的项目</p>
              <div className="flex flex-wrap gap-2">
                {teamDetails?.projects.map((project) => (
                  <span
                    key={project}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
