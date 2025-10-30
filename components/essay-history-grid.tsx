"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import Link from "next/link"

interface Essay {
  id: string
  topic: string
  essay_text: string
  score: number | null
  created_at: string
}

interface EssayHistoryGridProps {
  essays: Essay[]
}

export default function EssayHistoryGrid({ essays }: EssayHistoryGridProps) {
  if (essays.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No essays found</h3>
        <p className="text-slate-500 mb-6">Try practicing essay writing to see your submissions here.</p>
        <Link href="/essay-practice">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Start Essay Practice</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {essays.map((essay) => (
        <Card key={essay.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-2">{essay.topic || "Essay"}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(essay.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              {essay.score && (
                <Badge
                  variant={essay.score >= 80 ? "default" : essay.score >= 60 ? "secondary" : "destructive"}
                  className="ml-2"
                >
                  {essay.score}/100
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-slate-800 text-sm mb-1">Essay:</h4>
                <p className="text-sm text-slate-600 line-clamp-3">{essay.essay_text}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  {essay.essay_text.split(/\s+/).filter((word) => word.length > 0).length} words
                </div>
                <Link href={`/essay/${essay.id}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 bg-transparent"
                  >
                    View Feedback
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
