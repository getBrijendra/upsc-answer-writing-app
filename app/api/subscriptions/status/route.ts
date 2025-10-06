import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get active subscriptions
    const { data: subscriptions, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        payment_plans (
          name,
          description,
          credits,
          price_inr,
          subscription_duration_days
        )
      `)
      .eq("user_id", user.id)
      .in("status", ["active", "paused"])
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching subscriptions:", error)
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
    }

    // Check for expired subscriptions and update them
    const now = new Date()
    const expiredSubscriptions =
      subscriptions?.filter((sub) => new Date(sub.end_date) < now && sub.status === "active") || []

    if (expiredSubscriptions.length > 0) {
      const expiredIds = expiredSubscriptions.map((sub) => sub.id)
      await supabase
        .from("subscriptions")
        .update({ status: "expired", updated_at: new Date().toISOString() })
        .in("id", expiredIds)
    }

    // Return updated subscription data
    const activeSubscriptions =
      subscriptions?.filter((sub) => new Date(sub.end_date) >= now || sub.status === "paused") || []

    return NextResponse.json({ subscriptions: activeSubscriptions })
  } catch (error) {
    console.error("Error in subscription status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
