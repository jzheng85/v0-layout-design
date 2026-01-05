"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Edit, Save, X, Plus, Trash2, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  region: z.array(z.string()).min(1, "At least one region must be selected"),
  document: z.array(
    z.object({
      type: z.string().min(1, "Document type is required"),
      url: z.string().url("Must be a valid URL"),
    }),
  ),
  repo: z.array(z.string().url("Must be a valid URL")),
  owner: z.string().min(1, "Owner is required"),
  designer: z.string().min(1, "Designer is required"),
})

type ProjectData = z.infer<typeof projectSchema>

const AVAILABLE_REGIONS = ["HK", "UK", "US", "CN", "SG", "JP", "AU"]

export default function DocumentsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [data, setData] = useState<ProjectData | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      region: [],
      document: [],
      repo: [],
      owner: "",
      designer: "",
    },
  })

  const {
    fields: documentFields,
    append: appendDocument,
    remove: removeDocument,
  } = useFieldArray({
    control,
    name: "document",
  })

  const {
    fields: repoFields,
    append: appendRepo,
    remove: removeRepo,
  } = useFieldArray({
    control,
    name: "repo",
  })

  const regions = watch("region")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const mockData: ProjectData = {
        name: "TWD",
        region: ["HK", "UK"],
        document: [
          { type: "design", url: "http://example.com/design" },
          { type: "review", url: "https://example.com/review" },
        ],
        repo: ["https://github.com/example/repo1", "https://github.com/example/repo2"],
        owner: "Jason ZHENG",
        designer: "Branko CHEN",
      }
      setData(mockData)
      reset(mockData)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (data) {
      reset(data)
    }
    setIsEditing(false)
  }

  const onSubmit = async (formData: ProjectData) => {
    setIsSaving(true)
    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 500))
      setData(formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save data:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleRegion = (region: string) => {
    const currentRegions = regions || []
    if (currentRegions.includes(region)) {
      setValue(
        "region",
        currentRegions.filter((r) => r !== region),
      )
    } else {
      setValue("region", [...currentRegions, region])
    }
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
                <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Submit"}
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                {isEditing ? (
                  <div>
                    <Input id="name" {...register("name")} placeholder="Enter project name" />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                  </div>
                ) : (
                  <p className="text-lg font-medium">{data?.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      {AVAILABLE_REGIONS.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region}`}
                            checked={regions?.includes(region)}
                            onCheckedChange={() => toggleRegion(region)}
                          />
                          <Label htmlFor={`region-${region}`} className="text-sm font-normal cursor-pointer">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.region && <p className="text-sm text-destructive mt-2">{errors.region.message}</p>}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {data?.region.map((region, index) => (
                      <Badge key={index} variant="secondary">
                        {region}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                {isEditing ? (
                  <div>
                    <Input id="owner" {...register("owner")} placeholder="Enter owner name" />
                    {errors.owner && <p className="text-sm text-destructive mt-1">{errors.owner.message}</p>}
                  </div>
                ) : (
                  <p className="text-lg font-medium">{data?.owner}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="designer">Designer</Label>
                {isEditing ? (
                  <div>
                    <Input id="designer" {...register("designer")} placeholder="Enter designer name" />
                    {errors.designer && <p className="text-sm text-destructive mt-1">{errors.designer.message}</p>}
                  </div>
                ) : (
                  <p className="text-lg font-medium">{data?.designer}</p>
                )}
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Documents</Label>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => appendDocument({ type: "", url: "" })}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Document
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {isEditing ? (
                  documentFields.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No documents added</p>
                  ) : (
                    documentFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <Input {...register(`document.${index}.type`)} placeholder="Document type" />
                            {errors.document?.[index]?.type && (
                              <p className="text-sm text-destructive mt-1">{errors.document[index]?.type?.message}</p>
                            )}
                          </div>
                          <div>
                            <Input {...register(`document.${index}.url`)} placeholder="Document URL" />
                            {errors.document?.[index]?.url && (
                              <p className="text-sm text-destructive mt-1">{errors.document[index]?.url?.message}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeDocument(index)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )
                ) : data?.document.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No documents added</p>
                ) : (
                  data?.document.map((doc, index) => (
                    <div key={index} className="flex-1 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
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
                  ))
                )}
              </div>
            </div>

            {/* Repositories Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Repositories</Label>
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => appendRepo("")}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Repository
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {isEditing ? (
                  repoFields.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No repositories added</p>
                  ) : (
                    repoFields.map((field, index) => (
                      <div key={field.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <Input {...register(`repo.${index}`)} placeholder="Repository URL" />
                          {errors.repo?.[index] && (
                            <p className="text-sm text-destructive mt-1">{errors.repo[index]?.message}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeRepo(index)}
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )
                ) : data?.repo.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No repositories added</p>
                ) : (
                  data?.repo.map((repo, index) => (
                    <div key={index} className="flex-1 p-3 rounded-lg bg-muted/50">
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
                  ))
                )}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
