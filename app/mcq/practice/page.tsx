import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock } from "lucide-react"
import Link from "next/link"

export default async function MCQPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ generated?: string; subject?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user's questions
  let questionsQuery = supabase
    .from("mcq_questions")
    .select("*, subjects(name)")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })

  if (params.subject) {
    questionsQuery = questionsQuery.eq("subject_id", params.subject)
  }

  const { data: questions } = await questionsQuery

  // Get subjects for filtering
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2 break-words">Practice MCQ Questions</h1>
          <p className="text-gray-600 text-lg">Test your knowledge with generated questions</p>
          {params.generated && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm">✓ Questions generated successfully! Start practicing below.</p>
            </div>
          )}
        </div>

        {/* Subject Filter */}
        {/* {subjects && subjects.length > 0 && (
          <Card className="mb-8 bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg text-black">Filter by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Link href="/mcq/practice">
                  <Badge variant={!params.subject ? "default" : "outline"} className="cursor-pointer">
                    All Subjects
                  </Badge>
                </Link>
                {subjects.map((subject) => (
                  <Link key={subject.id} href={`/mcq/practice?subject=${subject.id}`}>
                    <Badge variant={params.subject === subject.id ? "default" : "outline"} className="cursor-pointer">
                      {subject.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Questions Grid */}
        {questions && questions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question: any) => (
              <Card
                key={question.id}
                className="hover:shadow-lg transition-shadow bg-white border border-gray-200 overflow-hidden flex flex-col"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-200 whitespace-nowrap truncate max-w-[150px]"
                    >
                      {question.subjects?.name || "General"}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{new Date(question.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 text-black break-words leading-snug">
                    {question.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow justify-between">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 truncate">
                      <strong>Options:</strong> {question.options?.length || 0} choices
                    </div>

                    {question.source_content && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100 overflow-hidden">
                        <strong>Source:</strong>{" "}
                        <span className="line-clamp-2 break-words">
                          {question.source_content.substring(0, 100)}...
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <Link href={`/mcq/question/${question.id}`}>
                      <Button className="w-full bg-black text-white hover:bg-gray-800">
                        <Brain className="w-4 h-4 mr-2" />
                        Practice Question
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 bg-white border border-gray-200">
            <CardContent>
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Questions Available</h3>
              <p className="text-gray-500 mb-6">
                {params.subject
                  ? "No questions found for this subject. Try generating some questions first."
                  : "You haven't generated any questions yet. Create some to start practicing!"}
              </p>
              <Link href="/mcq/generate">
                <Button className="bg-black text-white hover:bg-gray-800">Generate Questions</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
