"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Edit, Eye, EyeOff, Calendar, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DailyQuestion {
  id: string
  question: string
  published_date: string
  difficulty_level: "Easy" | "Medium" | "Hard"
  word_limit: number
  time_limit: number
  is_active: boolean
  created_at: string
  subjects?: { name: string }
}

interface DailyQuestionsTableProps {
  questions: DailyQuestion[]
}

export default function DailyQuestionsTable({ questions }: DailyQuestionsTableProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const toggleActive = async (questionId: string, currentStatus: boolean) => {
    setLoading(questionId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("daily_questions")
        .update({ is_active: !currentStatus })
        .eq("id", questionId)

      if (error) {
        console.error("Error updating question status:", error)
        alert("Failed to update question status")
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to update question status")
    } finally {
      setLoading(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (questions.length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Questions Found</h3>
          <p className="text-gray-600 text-center mb-4">Start by creating your first daily question for students.</p>
          <Link href="/admin/daily-questions/new">
            <Button className="bg-black text-white hover:bg-gray-800">Create First Question</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {new Date(question.published_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <Badge className={getDifficultyColor(question.difficulty_level)}>{question.difficulty_level}</Badge>
                  {question.is_active ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Eye className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mb-2 line-clamp-2">{question.question}</CardTitle>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {question.subjects?.name || "General"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Edit className="w-4 h-4" />
                    {question.word_limit} words
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {question.time_limit} minutes
                  </span>
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Active</span>
                  <Switch
                    checked={question.is_active}
                    onCheckedChange={() => toggleActive(question.id, question.is_active)}
                    disabled={loading === question.id}
                  />
                </div>
                <Link href={`/admin/daily-questions/${question.id}/edit`}>
                  <Button size="sm" variant="outline" className="hover:bg-gray-100 bg-transparent">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
