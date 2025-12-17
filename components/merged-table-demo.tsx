import { MergedTableClient, SampleData } from "./merged-table-client"

async function fetchSampleData(): Promise<SampleData[]> {
  const response = await fetch("http://localhost:8080/sample", {
    cache: "no-store", // 禁用缓存，确保每次都获取最新数据
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}

// 服务器组件 - 只负责数据获取
export async function MergedTableDemo() {
  try {
    const sampleData = await fetchSampleData()
    
    if (sampleData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <p className="text-gray-500">暂无数据</p>
          </div>
        </div>
      )
    }
    
    return <MergedTableClient data={sampleData} />
  } catch (error) {
    console.error("Failed to fetch data:", error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <p className="text-red-500 font-medium mb-2">数据加载失败</p>
          <p className="text-gray-500 text-sm">
            {error instanceof Error ? error.message : "获取数据失败"}
          </p>
        </div>
      </div>
    )
  }
}
