"use client"
import { Button } from "@/components/ui/button"
import { Lightbulb, Target, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

interface SubjectData {
  subject: string
  average: number
  count: number
}

interface ImprovementSuggestionsProps {
  averageScore: number
  subjectData: SubjectData[]
  totalAnswers: number
  improvement: number
}

export default function ImprovementSuggestions({
  averageScore,
  subjectData,
  totalAnswers,
  improvement,
}: ImprovementSuggestionsProps) {
  const suggestions = []

  // Score-based suggestions
  if (averageScore < 60) {
    suggestions.push({
      type: "critical",
      icon: AlertCircle,
      title: "Focus on Fundamentals",
      description: "Your average score suggests you need to strengthen basic concepts. Consider reviewing core topics.",
      action: "Start with easier questions",
      actionLink: "/practice",
    })
  } else if (averageScore < 75) {
    suggestions.push({
      type: "improvement",
      icon: Target,
      title: "Aim Higher",
      description: "You're doing well! Focus on advanced topics and detailed explanations to reach the next level.",
      action: "Practice advanced questions",
      actionLink: "/practice",
    })
  } else {
    suggestions.push({
      type: "excellent",
      icon: TrendingUp,
      title: "Maintain Excellence",
      description: "Great work! Keep practicing regularly to maintain your high performance standards.",
      action: "Continue regular practice",
      actionLink: "/practice",
    })
  }

  // Subject-specific suggestions
  const weakestSubject = subjectData.reduce((min, subject) => (subject.average < min.average ? subject : min), {
    subject: "",
    average: 100,
    count: 0,
  })

  if (weakestSubject.subject && weakestSubject.average < averageScore - 10) {
    suggestions.push({
      type: "subject",
      icon: BookOpen,
      title: `Improve ${weakestSubject.subject}`,
      description: `Your performance in ${weakestSubject.subject} is below your overall average. Focus more practice here.`,
      action: "Practice this subject",
      actionLink: "/practice",
    })
  }

  // Volume-based suggestions
  if (totalAnswers < 10) {
    suggestions.push({
      type: "practice",
      icon: Lightbulb,
      title: "Practice More Regularly",
      description: "Consistent practice is key to improvement. Try to submit at least 2-3 answers per week.",
      action: "Set a practice schedule",
      actionLink: "/practice",
    })
  }

  // Improvement trend suggestions
  if (improvement < -5) {
    suggestions.push({
      type: "trend",
      icon: AlertCircle,
      title: "Address Declining Performance",
      description: "Your recent scores show a downward trend. Review your recent answers and identify common mistakes.",
      action: "Review recent answers",
      actionLink: "/profile",
    })
  } else if (improvement > 10) {
    suggestions.push({
      type: "positive",
      icon: TrendingUp,
      title: "Great Progress!",
      description: "Your scores are improving consistently. Keep up the excellent work and maintain this momentum.",
      action: "Continue current approach",
      actionLink: "/practice",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "improvement":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "excellent":
        return "text-green-600 bg-green-50 border-green-200"
      case "subject":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "practice":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "trend":
        return "text-red-600 bg-red-50 border-red-200"
      case "positive":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-slate-600 bg-slate-50 border-slate-200"
    }
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Lightbulb className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>Keep practicing to get personalized suggestions!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {suggestions.map((suggestion, index) => {
        const IconComponent = suggestion.icon
        return (
          <div key={index} className={`p-4 rounded-lg border ${getTypeColor(suggestion.type)}`}>
            <div className="flex items-start gap-3">
              <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                <p className="text-sm mb-3 opacity-90">{suggestion.description}</p>
                <Link href={suggestion.actionLink}>
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    {suggestion.action}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
