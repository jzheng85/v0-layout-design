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
  email: string
  phone: string
  hireDate: string
  salaryLevel: string
  location: string
  experience: number
  education: string
  birthDate: string
  gender: string
  maritalStatus: string
  emergencyContact: string
  emergencyPhone: string
  skills: string
  certifications: string
  language: string
  performanceRating: string
  lastPromotion: string
}

const sampleData: SampleData[] = [
  // 技术部
  {
    department: "技术部",
    team: "前端团队",
    employee: "张三",
    role: "高级工程师",
    status: "在职",
    progress: 85,
    email: "zhangsan@company.com",
    phone: "138-1234-5678",
    hireDate: "2020-03-15",
    salaryLevel: "P7",
    location: "北京",
    experience: 6,
    education: "本科",
    birthDate: "1994-05-20",
    gender: "男",
    maritalStatus: "已婚",
    emergencyContact: "李梅",
    emergencyPhone: "139-8765-4321",
    skills: "React, Vue, TypeScript",
    certifications: "AWS认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2023-03-01",
  },
  {
    department: "技术部",
    team: "前端团队",
    employee: "李四",
    role: "工程师",
    status: "在职",
    progress: 92,
    email: "lisi@company.com",
    phone: "139-2345-6789",
    hireDate: "2021-06-20",
    salaryLevel: "P6",
    location: "北京",
    experience: 4,
    education: "硕士",
    birthDate: "1996-08-12",
    gender: "女",
    maritalStatus: "未婚",
    emergencyContact: "李建国",
    emergencyPhone: "138-7654-3210",
    skills: "JavaScript, CSS, HTML5",
    certifications: "PMP认证",
    language: "英语-良好",
    performanceRating: "优秀",
    lastPromotion: "2023-06-15",
  },
  {
    department: "技术部",
    team: "前端团队",
    employee: "陈九",
    role: "实习生",
    status: "在职",
    progress: 68,
    email: "chenjiu@company.com",
    phone: "136-3456-7890",
    hireDate: "2024-01-10",
    salaryLevel: "P3",
    location: "北京",
    experience: 0,
    education: "本科",
    birthDate: "2002-03-15",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "陈父",
    emergencyPhone: "137-6543-2109",
    skills: "HTML, CSS, JavaScript",
    certifications: "无",
    language: "英语-一般",
    performanceRating: "良好",
    lastPromotion: "无",
  },
  {
    department: "技术部",
    team: "后端团队",
    employee: "王五",
    role: "架构师",
    status: "在职",
    progress: 78,
    email: "wangwu@company.com",
    phone: "137-4567-8901",
    hireDate: "2018-09-01",
    salaryLevel: "P8",
    location: "北京",
    experience: 10,
    education: "硕士",
    birthDate: "1990-11-08",
    gender: "男",
    maritalStatus: "已婚",
    emergencyContact: "王芳",
    emergencyPhone: "136-5432-1098",
    skills: "Java, Spring, Microservices",
    certifications: "架构师认证",
    language: "英语-流利",
    performanceRating: "卓越",
    lastPromotion: "2022-09-01",
  },
  {
    department: "技术部",
    team: "后端团队",
    employee: "赵六",
    role: "工程师",
    status: "在职",
    progress: 65,
    email: "zhaoliu@company.com",
    phone: "135-5678-9012",
    hireDate: "2022-02-15",
    salaryLevel: "P5",
    location: "上海",
    experience: 3,
    education: "本科",
    birthDate: "1997-07-22",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "赵母",
    emergencyPhone: "135-4321-0987",
    skills: "Python, Django, MySQL",
    certifications: "无",
    language: "英语-良好",
    performanceRating: "良好",
    lastPromotion: "2023-12-01",
  },
  {
    department: "技术部",
    team: "后端团队",
    employee: "刘十",
    role: "高级工程师",
    status: "休假",
    progress: 82,
    email: "liushi@company.com",
    phone: "134-6789-0123",
    hireDate: "2019-11-20",
    salaryLevel: "P7",
    location: "上海",
    experience: 7,
    education: "硕士",
    birthDate: "1993-02-14",
    gender: "女",
    maritalStatus: "已婚",
    emergencyContact: "刘军",
    emergencyPhone: "134-3210-9876",
    skills: "Node.js, Express, MongoDB",
    certifications: "Google Cloud认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2022-11-20",
  },
  {
    department: "技术部",
    team: "测试团队",
    employee: "杨十一",
    role: "测试经理",
    status: "在职",
    progress: 88,
    email: "yangshiyi@company.com",
    phone: "133-7890-1234",
    hireDate: "2019-04-08",
    salaryLevel: "P7",
    location: "北京",
    experience: 8,
    education: "本科",
    birthDate: "1992-09-30",
    gender: "女",
    maritalStatus: "已婚",
    emergencyContact: "杨华",
    emergencyPhone: "133-2109-8765",
    skills: "Selenium, JMeter, QA",
    certifications: "ISTQB认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2022-04-08",
  },
  {
    department: "技术部",
    team: "测试团队",
    employee: "徐十二",
    role: "测试工程师",
    status: "在职",
    progress: 75,
    email: "xushier@company.com",
    phone: "132-8901-2345",
    hireDate: "2021-08-12",
    salaryLevel: "P6",
    location: "北京",
    experience: 5,
    education: "本科",
    birthDate: "1995-12-05",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "徐父",
    emergencyPhone: "132-1098-7654",
    skills: "Postman, Appium, TestNG",
    certifications: "无",
    language: "英语-良好",
    performanceRating: "良好",
    lastPromotion: "2023-08-12",
  },

  // 市场部
  {
    department: "市场部",
    team: "品牌团队",
    employee: "孙七",
    role: "经理",
    status: "在职",
    progress: 45,
    email: "sunqi@company.com",
    phone: "131-9012-3456",
    hireDate: "2020-05-18",
    salaryLevel: "P7",
    location: "上海",
    experience: 6,
    education: "硕士",
    birthDate: "1994-04-18",
    gender: "女",
    maritalStatus: "已婚",
    emergencyContact: "孙伟",
    emergencyPhone: "131-0987-6543",
    skills: "品牌策略, 市场营销",
    certifications: "CMO认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2023-05-18",
  },
  {
    department: "市场部",
    team: "品牌团队",
    employee: "周八",
    role: "专员",
    status: "休假",
    progress: 28,
    email: "zhouba@company.com",
    phone: "130-0123-4567",
    hireDate: "2022-09-25",
    salaryLevel: "P5",
    location: "上海",
    experience: 2,
    education: "本科",
    birthDate: "1998-06-10",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "周母",
    emergencyPhone: "130-9876-5432",
    skills: "社交媒体, 内容创作",
    certifications: "无",
    language: "英语-一般",
    performanceRating: "合格",
    lastPromotion: "无",
  },
  {
    department: "市场部",
    team: "品牌团队",
    employee: "吴十三",
    role: "设计师",
    status: "在职",
    progress: 56,
    email: "wushisan@company.com",
    phone: "138-1122-3344",
    hireDate: "2021-12-01",
    salaryLevel: "P6",
    location: "深圳",
    experience: 4,
    education: "本科",
    birthDate: "1996-01-25",
    gender: "女",
    maritalStatus: "未婚",
    emergencyContact: "吴父",
    emergencyPhone: "138-8765-4321",
    skills: "Photoshop, Illustrator",
    certifications: "Adobe认证",
    language: "英语-良好",
    performanceRating: "良好",
    lastPromotion: "2023-06-01",
  },
  {
    department: "市场部",
    team: "运营团队",
    employee: "郑十四",
    role: "运营经理",
    status: "在职",
    progress: 72,
    email: "zhengshisi@company.com",
    phone: "139-2233-4455",
    hireDate: "2019-07-15",
    salaryLevel: "P7",
    location: "深圳",
    experience: 7,
    education: "硕士",
    birthDate: "1993-10-08",
    gender: "男",
    maritalStatus: "已婚",
    emergencyContact: "郑丽",
    emergencyPhone: "139-7654-3210",
    skills: "数据分析, 用户运营",
    certifications: "数据分析师认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2022-07-15",
  },
  {
    department: "市场部",
    team: "运营团队",
    employee: "钱十五",
    role: "运营专员",
    status: "在职",
    progress: 63,
    email: "qianshiwu@company.com",
    phone: "136-3344-5566",
    hireDate: "2022-03-20",
    salaryLevel: "P5",
    location: "深圳",
    experience: 3,
    education: "本科",
    birthDate: "1997-11-12",
    gender: "女",
    maritalStatus: "未婚",
    emergencyContact: "钱母",
    emergencyPhone: "136-6543-2109",
    skills: "活动策划, 用户增长",
    certifications: "无",
    language: "英语-良好",
    performanceRating: "良好",
    lastPromotion: "2023-09-01",
  },

  // 产品部
  {
    department: "产品部",
    team: "前端团队",
    employee: "冯十六",
    role: "产品经理",
    status: "在职",
    progress: 91,
    email: "fengshiliu@company.com",
    phone: "137-4455-6677",
    hireDate: "2018-11-05",
    salaryLevel: "P8",
    location: "北京",
    experience: 9,
    education: "硕士",
    birthDate: "1991-03-22",
    gender: "男",
    maritalStatus: "已婚",
    emergencyContact: "冯静",
    emergencyPhone: "137-5432-1098",
    skills: "产品设计, 原型设计",
    certifications: "产品经理认证",
    language: "英语-流利",
    performanceRating: "卓越",
    lastPromotion: "2021-11-05",
  },
  {
    department: "产品部",
    team: "前端团队",
    employee: "陈十七",
    role: "UI设计师",
    status: "在职",
    progress: 84,
    email: "chenshiqi@company.com",
    phone: "135-5566-7788",
    hireDate: "2020-08-12",
    salaryLevel: "P6",
    location: "北京",
    experience: 5,
    education: "本科",
    birthDate: "1995-07-14",
    gender: "女",
    maritalStatus: "未婚",
    emergencyContact: "陈父",
    emergencyPhone: "135-4321-0987",
    skills: "Figma, Sketch, UI设计",
    certifications: "UI/UX认证",
    language: "英语-良好",
    performanceRating: "优秀",
    lastPromotion: "2023-02-01",
  },
  {
    department: "产品部",
    team: "前端团队",
    employee: "褚十八",
    role: "交互设计师",
    status: "在职",
    progress: 77,
    email: "chushiba@company.com",
    phone: "134-6677-8899",
    hireDate: "2021-04-22",
    salaryLevel: "P6",
    location: "上海",
    experience: 4,
    education: "硕士",
    birthDate: "1996-09-03",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "褚母",
    emergencyPhone: "134-3210-9876",
    skills: "交互设计, 用户研究",
    certifications: "交互设计认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2023-04-22",
  },
  {
    department: "产品部",
    team: "数据团队",
    employee: "卫十九",
    role: "数据分析师",
    status: "在职",
    progress: 95,
    email: "weishijiu@company.com",
    phone: "133-7788-9900",
    hireDate: "2019-02-28",
    salaryLevel: "P7",
    location: "上海",
    experience: 8,
    education: "硕士",
    birthDate: "1992-12-19",
    gender: "女",
    maritalStatus: "已婚",
    emergencyContact: "卫强",
    emergencyPhone: "133-2109-8765",
    skills: "SQL, Python, Tableau",
    certifications: "数据分析师认证",
    language: "英语-流利",
    performanceRating: "卓越",
    lastPromotion: "2022-02-28",
  },
  {
    department: "产品部",
    team: "数据团队",
    employee: "蒋二十",
    role: "数据工程师",
    status: "在职",
    progress: 88,
    email: "jiangershi@company.com",
    phone: "132-8899-0011",
    hireDate: "2020-10-15",
    salaryLevel: "P7",
    location: "北京",
    experience: 6,
    education: "博士",
    birthDate: "1990-05-30",
    gender: "男",
    maritalStatus: "已婚",
    emergencyContact: "蒋莉",
    emergencyPhone: "132-1098-7654",
    skills: "Spark, Hadoop, ETL",
    certifications: "大数据工程师认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2022-10-15",
  },

  // 人力资源部
  {
    department: "人力资源部",
    team: "招聘团队",
    employee: "沈二一",
    role: "招聘经理",
    status: "在职",
    progress: 58,
    email: "sheneryi@company.com",
    phone: "131-9900-1122",
    hireDate: "2021-01-08",
    salaryLevel: "P6",
    location: "北京",
    experience: 5,
    education: "本科",
    birthDate: "1995-08-07",
    gender: "女",
    maritalStatus: "未婚",
    emergencyContact: "沈父",
    emergencyPhone: "131-0987-6543",
    skills: "招聘, 人才评估",
    certifications: "HR认证",
    language: "英语-良好",
    performanceRating: "良好",
    lastPromotion: "2023-01-08",
  },
  {
    department: "人力资源部",
    team: "招聘团队",
    employee: "韩二二",
    role: "招聘专员",
    status: "在职",
    progress: 42,
    email: "hanerer@company.com",
    phone: "130-0011-2233",
    hireDate: "2023-03-15",
    salaryLevel: "P4",
    location: "北京",
    experience: 2,
    education: "本科",
    birthDate: "1999-02-20",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "韩母",
    emergencyPhone: "130-9876-5432",
    skills: "招聘, 面试",
    certifications: "无",
    language: "英语-一般",
    performanceRating: "合格",
    lastPromotion: "无",
  },
  {
    department: "人力资源部",
    team: "培训团队",
    employee: "杨二三",
    role: "培训经理",
    status: "在职",
    progress: 67,
    email: "yangersan@company.com",
    phone: "138-1133-2244",
    hireDate: "2020-06-30",
    salaryLevel: "P6",
    location: "上海",
    experience: 6,
    education: "硕士",
    birthDate: "1994-11-11",
    gender: "女",
    maritalStatus: "已婚",
    emergencyContact: "杨明",
    emergencyPhone: "138-8765-4321",
    skills: "培训开发, 课程设计",
    certifications: "培训师认证",
    language: "英语-流利",
    performanceRating: "优秀",
    lastPromotion: "2023-06-30",
  },
  {
    department: "人力资源部",
    team: "培训团队",
    employee: "朱二四",
    role: "培训讲师",
    status: "休假",
    progress: 51,
    email: "zhuersi@company.com",
    phone: "139-2244-3355",
    hireDate: "2022-11-18",
    salaryLevel: "P5",
    location: "上海",
    experience: 3,
    education: "本科",
    birthDate: "1997-04-28",
    gender: "男",
    maritalStatus: "未婚",
    emergencyContact: "朱父",
    emergencyPhone: "139-7654-3210",
    skills: "演讲, 授课",
    certifications: "无",
    language: "英语-良好",
    performanceRating: "良好",
    lastPromotion: "无",
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
              defaultVisible: true,
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
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
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
            {
              key: "email",
              header: "邮箱",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm",
            },
            {
              key: "phone",
              header: "电话",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
            },
            {
              key: "hireDate",
              header: "入职日期",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
            },
            {
              key: "salaryLevel",
              header: "薪资等级",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              render: (value) => (
                <span className="inline-flex items-center rounded-md bg-blue-500/10 text-blue-500 px-2 py-1 text-xs font-medium">
                  {value}
                </span>
              ),
            },
            {
              key: "location",
              header: "办公地点",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "whitespace-nowrap",
            },
            {
              key: "experience",
              header: "工作年限",
              merge: false,
              sortable: true,
              defaultVisible: false,
              render: (value) => <span>{value}年</span>,
            },
            {
              key: "education",
              header: "学历",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
            },
            {
              key: "birthDate",
              header: "出生日期",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
            },
            {
              key: "gender",
              header: "性别",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm",
            },
            {
              key: "maritalStatus",
              header: "婚姻状况",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
            },
            {
              key: "emergencyContact",
              header: "紧急联系人",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm",
            },
            {
              key: "emergencyPhone",
              header: "紧急联系电话",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
            },
            {
              key: "skills",
              header: "技能",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm",
            },
            {
              key: "certifications",
              header: "证书",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm",
            },
            {
              key: "language",
              header: "语言能力",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
            },
            {
              key: "performanceRating",
              header: "绩效评级",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              render: (value) => (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap",
                    value === "卓越"
                      ? "bg-purple-500/10 text-purple-500"
                      : value === "优秀"
                        ? "bg-green-500/10 text-green-500"
                        : value === "良好"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-500/10 text-gray-500",
                  )}
                >
                  {value}
                </span>
              ),
            },
            {
              key: "lastPromotion",
              header: "最近晋升",
              merge: false,
              filterable: true,
              sortable: true,
              defaultVisible: false,
              className: "text-sm whitespace-nowrap",
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
