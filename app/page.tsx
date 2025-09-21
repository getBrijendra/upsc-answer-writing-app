import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, Brain, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (data?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 text-balance">Master UPSC Answer Writing</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Practice with real UPSC questions, get AI-powered feedback, and track your progress with our comprehensive
            preparation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Start Practicing Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border border-gray-200">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PenTool className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl text-black">Answer Writing</CardTitle>
              <CardDescription className="text-gray-600">
                Practice with authentic UPSC questions across all subjects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border border-gray-200">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl text-black">AI Feedback</CardTitle>
              <CardDescription className="text-gray-600">
                Get detailed, personalized feedback on every answer you submit
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border border-gray-200">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl text-black">Progress Tracking</CardTitle>
              <CardDescription className="text-gray-600">
                Monitor your improvement with detailed analytics and insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white border border-gray-200">
            <CardHeader>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl text-black">MCQ Generator</CardTitle>
              <CardDescription className="text-gray-600">
                Generate practice questions from your study materials
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-black text-white rounded-2xl p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50,000+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2M+</div>
              <div className="text-gray-300">Answers Evaluated</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">85%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-gray-300">User Rating</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Excel in UPSC?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of aspirants who are improving their answer writing skills every day.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
