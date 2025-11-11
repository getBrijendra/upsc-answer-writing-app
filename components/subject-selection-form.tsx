"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

interface Subject {
  id: string
  name: string
  description: string
  category: string
}

interface SubjectSelectionFormProps {
  subjects: Subject[]
  currentSubjectId?: string
  hasSelectedSubject: boolean
}

export default function SubjectSelectionForm({
  subjects,
  currentSubjectId,
  hasSelectedSubject,
}: SubjectSelectionFormProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(currentSubjectId || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSubjectId) return

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      const { error } = await supabase
        .from("profiles")
        .update({ optional_subject_id: selectedSubjectId })
        .eq("id", user.id)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (hasSelectedSubject) {
    const currentSubject = subjects.find((s) => s.id === currentSubjectId)

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-600" />
            Optional Subject Selected
          </CardTitle>
          <CardDescription>
            You have selected an optional subject. This can only be changed by contacting our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black">{currentSubject?.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{currentSubject?.description}</p>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                To change your optional subject, please contact our support team at support@lemura.com with your
                request.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Optional Subject</CardTitle>
        <CardDescription>
          Choose an optional subject for your Civil Service Examination preparation. This can only be changed by contacting support once
          selected.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
<Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
  <SelectTrigger>
    <SelectValue placeholder="Select an optional subject" />
  </SelectTrigger>
  <SelectContent>
    {subjects
      .filter((subject) => subject.category === "OPTIONAL")
      .map((subject) => (
        <SelectItem key={subject.id} value={subject.id}>
          <div>
            <div className="font-medium">{subject.name}</div>
            <div className="text-sm text-gray-500">{subject.description}</div>
          </div>
        </SelectItem>
      ))}
  </SelectContent>
</Select>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Once you select an optional subject, it can only be changed by contacting our
              support team. Please choose carefully.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={!selectedSubjectId || isLoading}
            className="w-full bg-black hover:bg-gray-800"
          >
            {isLoading ? "Selecting..." : "Confirm Subject Selection"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
