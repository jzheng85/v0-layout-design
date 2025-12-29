"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Edit, Save, X, Plus, Trash2, ExternalLink } from "lucide-react"

interface Document {
  type: string
  url: string
}

interface ProjectData {
  name: string
  region: string
  document: Document[]
  repo: string[]
  owner: string
  designer: string
}

export default function DocumentsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<ProjectData>({
    name: "",
    region: "",
    document: [],
    repo: [],
    owner: "",
    designer: "",
  })
  const [editData, setEditData] = useState<ProjectData>(data)

  // Fetch data from API on mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/documents')
      // const result = await response.json()

      // Mock data for demonstration
      const mockData: ProjectData = {
        name: "TWD",
        region: "HK",
        document: [
          { type: "design", url: "http://xxxxxx" },
          { type: "review", url: "https://yyyyyyy" },
        ],
        repo: ["https://xxxxxxx", "https://bbbbbbb"],
        owner: "Jason ZHENG",
        designer: "Branko CHEN",
      }
      setData(mockData)
      setEditData(mockData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setEditData({ ...data })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData({ ...data })
    setIsEditing(false)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/documents', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editData),
      // })
      // if (response.ok) {
      //   const result = await response.json()
      //   setData(result)
      // }

      // Mock save for demonstration
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData({ ...editData })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const addDocument = () => {
    setEditData({
      ...editData,
      document: [...editData.document, { type: "", url: "" }],
    })
  }

  const removeDocument = (index: number) => {
    setEditData({
      ...editData,
      document: editData.document.filter((_, i) => i !== index),
    })
  }

  const updateDocument = (index: number, field: keyof Document, value: string) => {
    const newDocuments = [...editData.document]
    newDocuments[index] = { ...newDocuments[index], [field]: value }
    setEditData({ ...editData, document: newDocuments })
  }

  const addRepo = () => {
    setEditData({
      ...editData,
      repo: [...editData.repo, ""],
    })
  }

  const removeRepo = (index: number) => {
    setEditData({
      ...editData,
      repo: editData.repo.filter((_, i) => i !== index),
    })
  }

  const updateRepo = (index: number, value: string) => {
    const newRepos = [...editData.repo]
    newRepos[index] = value
    setEditData({ ...editData, repo: newRepos })
  }

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </main>
    )
  }

  const displayData = isEditing ? editData : data

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Documents</h1>
            <p className="text-muted-foreground mt-1">View and manage project documentation</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            ) : (
              <>
                <Button onClick={handleCancel} variant="outline" className="gap-2 bg-transparent">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Submit"}
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              ) : (
                <p className="text-lg font-medium">{data.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              {isEditing ? (
                <Input
                  id="region"
                  value={editData.region}
                  onChange={(e) => setEditData({ ...editData, region: e.target.value })}
                  placeholder="Enter region"
                />
              ) : (
                <p className="text-lg font-medium">{data.region}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              {isEditing ? (
                <Input
                  id="owner"
                  value={editData.owner}
                  onChange={(e) => setEditData({ ...editData, owner: e.target.value })}
                  placeholder="Enter owner name"
                />
              ) : (
                <p className="text-lg font-medium">{data.owner}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designer">Designer</Label>
              {isEditing ? (
                <Input
                  id="designer"
                  value={editData.designer}
                  onChange={(e) => setEditData({ ...editData, designer: e.target.value })}
                  placeholder="Enter designer name"
                />
              ) : (
                <p className="text-lg font-medium">{data.designer}</p>
              )}
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Documents</Label>
              {isEditing && (
                <Button onClick={addDocument} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Document
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {displayData.document.length === 0 ? (
                <p className="text-muted-foreground text-sm">No documents added</p>
              ) : (
                displayData.document.map((doc, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    {isEditing ? (
                      <>
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <Input
                            value={doc.type}
                            onChange={(e) => updateDocument(index, "type", e.target.value)}
                            placeholder="Document type"
                          />
                          <Input
                            value={doc.url}
                            onChange={(e) => updateDocument(index, "url", e.target.value)}
                            placeholder="Document URL"
                          />
                        </div>
                        <Button
                          onClick={() => removeDocument(index)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{doc.type}</p>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {doc.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Repositories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Repositories</Label>
              {isEditing && (
                <Button onClick={addRepo} variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Repository
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {displayData.repo.length === 0 ? (
                <p className="text-muted-foreground text-sm">No repositories added</p>
              ) : (
                displayData.repo.map((repo, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    {isEditing ? (
                      <>
                        <Input
                          value={repo}
                          onChange={(e) => updateRepo(index, e.target.value)}
                          placeholder="Repository URL"
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeRepo(index)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <div className="flex-1 p-3 rounded-lg bg-muted/50">
                        <a
                          href={repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {repo}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
