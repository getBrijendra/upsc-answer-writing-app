import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import MCQGeneratorForm from "@/components/mcq-generator-form"

export default async function GenerateMCQPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get subjects for the form
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Generate MCQ Questions</h1>
          <p className="text-gray-600 text-lg">Create practice questions from your study materials</p>
        </div>

        <MCQGeneratorForm subjects={subjects || []} />
      </div>
    </div>
  )
}
