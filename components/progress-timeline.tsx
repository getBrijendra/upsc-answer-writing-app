"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"

interface Answer {
  id: string
  score: number | null
  created_at: string
  question: string
  subjects: {
    name: string
  } | null
}

interface ProgressTimelineProps {
  answers: Answer[]
}

export default function ProgressTimeline({ answers }: ProgressTimelineProps) {
  if (!answers || answers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>No recent activity to display.</p>
      </div>
    )
  }

  // Sort answers by date (most recent first)
  const sortedAnswers = [...answers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {sortedAnswers.map((answer, index) => {
        const prevAnswer = sortedAnswers[index + 1]
        const scoreChange = prevAnswer?.score ? (answer.score || 0) - prevAnswer.score : null

        return (
          <div key={answer.id} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {answer.subjects?.name || "Unknown Subject"}
                </p>
                <div className="flex items-center gap-2">
                  {scoreChange !== null && (
                    <div className="flex items-center gap-1">
                      {scoreChange > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : scoreChange < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      ) : null}
                      {scoreChange !== 0 && (
                        <span className={`text-xs ${scoreChange > 0 ? "text-green-600" : "text-red-600"}`}>
                          {scoreChange > 0 ? "+" : ""}
                          {scoreChange}
                        </span>
                      )}
                    </div>
                  )}
                  {answer.score && (
                    <Badge
                      variant={answer.score >= 80 ? "default" : answer.score >= 60 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {answer.score}/100
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 truncate mb-1">{answer.question}</p>
              <p className="text-xs text-slate-500">{new Date(answer.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
