import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, Users, Settings, TrendingUp } from "lucide-react"
import Link from "next/link"
import CreditManagementTable from "@/components/credit-management-table"

export default async function CreditManagementPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get all credit costs
  const { data: creditCosts } = await supabase.from("credit_costs").select("*").order("operation_type")

  // Get user credit statistics
  const { data: userStats } = await supabase.from("user_credits").select("credits")

  const totalUsers = userStats?.length || 0
  const totalCreditsInSystem = userStats?.reduce((sum, user) => sum + user.credits, 0) || 0
  const averageCredits = totalUsers > 0 ? Math.round(totalCreditsInSystem / totalUsers) : 0

  // Get recent credit usage (from user_daily_attempts as example)
  const { data: recentUsage } = await supabase
    .from("user_daily_attempts")
    .select("credits_used")
    .not("credits_used", "is", null)
    .order("attempted_at", { ascending: false })
    .limit(100)

  const totalCreditsUsed = recentUsage?.reduce((sum, attempt) => sum + (attempt.credits_used || 0), 0) || 0

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Credit Management</h1>
              <p className="text-gray-600 text-lg">Manage AI operation costs and user credits</p>
            </div>
            <Link href="/admin/credits/settings">
              <Button className="bg-black text-white hover:bg-gray-800">
                <Settings className="w-4 h-4 mr-2" />
                Credit Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Users</CardTitle>
                <Users className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalUsers}</div>
              <p className="text-sm text-gray-600">Active users</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Total Credits</CardTitle>
                <Coins className="w-5 h-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalCreditsInSystem.toLocaleString()}</div>
              <p className="text-sm text-gray-600">In circulation</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Average Credits</CardTitle>
                <TrendingUp className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{averageCredits}</div>
              <p className="text-sm text-gray-600">Per user</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">Credits Used</CardTitle>
                <Settings className="w-5 h-5 text-black" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-black">{totalCreditsUsed}</div>
              <p className="text-sm text-gray-600">Recent usage</p>
            </CardContent>
          </Card>
        </div>

        {/* Credit Costs Table */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-black">AI Operation Costs</CardTitle>
            <CardDescription className="text-gray-600">
              Configure credit costs for different AI operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditManagementTable creditCosts={creditCosts || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
