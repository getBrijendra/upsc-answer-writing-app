"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Subject {
  id: string
  name: string
  description: string | null
}

interface SubjectFormProps {
  subject?: Subject
}

export default function SubjectForm({ subject }: SubjectFormProps) {
  const [name, setName] = useState(subject?.name || "")
  const [description, setDescription] = useState(subject?.description || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError("Subject name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createClient()

      if (subject) {
        // Update existing subject
        const { error: updateError } = await supabase
          .from("subjects")
          .update({
            name: name.trim(),
            description: description.trim() || null,
          })
          .eq("id", subject.id)

        if (updateError) throw updateError
      } else {
        // Create new subject
        const { error: insertError } = await supabase.from("subjects").insert({
          name: name.trim(),
          description: description.trim() || null,
        })

        if (insertError) throw insertError
      }

      router.push("/admin/subjects")
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("duplicate key")) {
        setError("A subject with this name already exists")
      } else {
        setError(error instanceof Error ? error.message : "An error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-800">{subject ? "Edit Subject" : "Create New Subject"}</CardTitle>
          <CardDescription>
            {subject ? "Update the subject information below" : "Add a new Civil Service Examination subject to the platform"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">
                Subject Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., General Studies Paper I"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                required
              />
              <p className="text-xs text-slate-500">This will be displayed to users when selecting subjects</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this subject covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-slate-500">Optional description to help users understand the subject scope</p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/subjects")}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {subject ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {subject ? "Update Subject" : "Create Subject"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
