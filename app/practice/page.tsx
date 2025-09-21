import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PracticePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all subjects
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Answer Writing Practice</h1>
          <p className="text-gray-600 text-lg">Choose a subject to start practicing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects?.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl text-black">{subject.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-gray-600">
                  {subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/practice/${subject.id}`}>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Start Practice</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
