import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Edit, Users } from "lucide-react"
import Link from "next/link"
import SubjectManagementTable from "@/components/subject-management-table"

export default async function SubjectManagementPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all subjects with usage statistics
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  // Get usage statistics for each subject
  const subjectsWithStats = await Promise.all(
    (subjects || []).map(async (subject) => {
      const { data: answerCount } = await supabase
        .from("answers")
        .select("id", { count: "exact" })
        .eq("subject_id", subject.id)

      const { data: mcqCount } = await supabase
        .from("mcq_questions")
        .select("id", { count: "exact" })
        .eq("subject_id", subject.id)

      return {
        ...subject,
        answer_count: answerCount?.length || 0,
        mcq_count: mcqCount?.length || 0,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Subject Management</h1>
              <p className="text-gray-600 text-lg">Manage Civil Service Examination subjects and their configurations</p>
            </div>
            <Link href="/admin/subjects/new">
              <Button className="bg-black text-white hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Add New Subject
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Subjects</CardTitle>
                <BookOpen className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{subjects?.length || 0}</div>
              <p className="text-sm text-gray-600">Available subjects</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Answers</CardTitle>
                <Edit className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {subjectsWithStats.reduce((sum, subject) => sum + subject.answer_count, 0)}
              </div>
              <p className="text-sm text-gray-600">Across all subjects</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total MCQs</CardTitle>
                <Users className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">
                {subjectsWithStats.reduce((sum, subject) => sum + subject.mcq_count, 0)}
              </div>
              <p className="text-sm text-gray-600">Generated questions</p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">All Subjects</CardTitle>
            <CardDescription className="text-gray-600">Manage and configure Civil Service Examination subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectManagementTable subjects={subjectsWithStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
