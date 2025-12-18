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
  // 技术部
  { department: "技术部", team: "前端团队", employee: "张三", role: "高级工程师", status: "在职", progress: 85 },
  { department: "技术部", team: "前端团队", employee: "李四", role: "工程师", status: "在职", progress: 92 },
  { department: "技术部", team: "前端团队", employee: "陈九", role: "实习生", status: "在职", progress: 68 },
  { department: "技术部", team: "后端团队", employee: "王五", role: "架构师", status: "在职", progress: 78 },
  { department: "技术部", team: "后端团队", employee: "赵六", role: "工程师", status: "在职", progress: 65 },
  { department: "技术部", team: "后端团队", employee: "刘十", role: "高级工程师", status: "休假", progress: 82 },
  { department: "技术部", team: "测试团队", employee: "杨十一", role: "测试经理", status: "在职", progress: 88 },
  { department: "技术部", team: "测试团队", employee: "徐十二", role: "测试工程师", status: "在职", progress: 75 },

  // 市场部
  { department: "市场部", team: "品牌团队", employee: "孙七", role: "经理", status: "在职", progress: 45 },
  { department: "市场部", team: "品牌团队", employee: "周八", role: "专员", status: "休假", progress: 28 },
  { department: "市场部", team: "品牌团队", employee: "吴十三", role: "设计师", status: "在职", progress: 56 },
  { department: "市场部", team: "运营团队", employee: "郑十四", role: "运营经理", status: "在职", progress: 72 },
  { department: "市场部", team: "运营团队", employee: "钱十五", role: "运营专员", status: "在职", progress: 63 },

  // 产品部
  { department: "产品部", team: "前端团队", employee: "冯十六", role: "产品经理", status: "在职", progress: 91 },
  { department: "产品部", team: "前端团队", employee: "陈十七", role: "UI设计师", status: "在职", progress: 84 },
  { department: "产品部", team: "前端团队", employee: "褚十八", role: "交互设计师", status: "在职", progress: 77 },
  { department: "产品部", team: "数据团队", employee: "卫十九", role: "数据分析师", status: "在职", progress: 95 },
  { department: "产品部", team: "数据团队", employee: "蒋二十", role: "数据工程师", status: "在职", progress: 88 },

  // 人力资源部
  { department: "人力资源部", team: "招聘团队", employee: "沈二一", role: "招聘经理", status: "在职", progress: 58 },
  { department: "人力资源部", team: "招聘团队", employee: "韩二二", role: "招聘专员", status: "在职", progress: 42 },
  { department: "人力资源部", team: "培训团队", employee: "杨二三", role: "培训经理", status: "在职", progress: 67 },
  { department: "人力资源部", team: "培训团队", employee: "朱二四", role: "培训讲师", status: "休假", progress: 51 },
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
  "技术部-前端团队": {
    teamName: "前端团队",
    department: "技术部",
    manager: "张三",
    memberCount: 3,
    avgProgress: 81.7,
    projects: ["电商平台", "管理系统", "移动应用"],
    description: "负责公司所有前端项目的开发与维护，使用React、Vue等现代框架。",
  },
  "技术部-后端团队": {
    teamName: "后端团队",
    department: "技术部",
    manager: "王五",
    memberCount: 3,
    avgProgress: 75.0,
    projects: ["API网关", "微服务架构", "数据库优化"],
    description: "负责后端服务开发，包括API设计、数据库管理和系统架构优化。",
  },
  "技术部-测试团队": {
    teamName: "测试团队",
    department: "技术部",
    manager: "杨十一",
    memberCount: 2,
    avgProgress: 81.5,
    projects: ["自动化测试", "性能测试", "质量保障"],
    description: "负责产品质量保障，包括功能测试、性能测试和自动化测试。",
  },
  "市场部-品牌团队": {
    teamName: "品牌团队",
    department: "市场部",
    manager: "孙七",
    memberCount: 3,
    avgProgress: 43.0,
    projects: ["品牌推广", "社交媒体运营", "内容营销"],
    description: "负责公司品牌建设、市场推广和社交媒体运营。",
  },
  "市场部-运营团队": {
    teamName: "运营团队",
    department: "市场部",
    manager: "郑十四",
    memberCount: 2,
    avgProgress: 67.5,
    projects: ["用户增长", "活动策划", "数据运营"],
    description: "负责产品运营、用户增长和数据分析。",
  },
  "产品部-前端团队": {
    teamName: "前端团队",
    department: "产品部",
    manager: "冯十六",
    memberCount: 3,
    avgProgress: 84.0,
    projects: ["产品设计", "用户体验优化", "原型设计"],
    description: "负责产品设计和用户体验优化，与技术团队紧密合作。",
  },
  "产品部-数据团队": {
    teamName: "数据团队",
    department: "产品部",
    manager: "卫十九",
    memberCount: 2,
    avgProgress: 91.5,
    projects: ["数据分析", "用户洞察", "商业智能"],
    description: "负责数据分析和用户行为研究，为产品决策提供数据支持。",
  },
  "人力资源部-招聘团队": {
    teamName: "招聘团队",
    department: "人力资源部",
    manager: "沈二一",
    memberCount: 2,
    avgProgress: 50.0,
    projects: ["人才招聘", "校园招聘", "雇主品牌"],
    description: "负责公司人才招聘和雇主品牌建设。",
  },
  "人力资源部-培训团队": {
    teamName: "培训团队",
    department: "人力资源部",
    manager: "杨二三",
    memberCount: 2,
    avgProgress: 59.0,
    projects: ["员工培训", "领导力发展", "知识管理"],
    description: "负责员工培训和发展，提升团队整体能力。",
  },
}

export function MergedTableDemo() {
  const [selectedTeamKey, setSelectedTeamKey] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTeamClick = (department: string, teamName: string) => {
    const teamKey = `${department}-${teamName}`
    setSelectedTeamKey(teamKey)
    setIsDialogOpen(true)
  }

  const teamDetails = selectedTeamKey ? teamDetailsMap[selectedTeamKey] : null

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
              render: (value, row) => (
                <button
                  onClick={() => handleTeamClick(row.department, value as string)}
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
                  <span className="font-medium">{teamDetails?.avgProgress.toFixed(1)}%</span>
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
