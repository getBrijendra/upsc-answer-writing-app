import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify subscription belongs to user
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    if (subscription.status !== "active") {
      return NextResponse.json({ error: "Subscription is not active" }, { status: 400 })
    }

    // Cancel subscription (set auto_renew to false, keep active until end date)
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        auto_renew: false,
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)

    if (updateError) {
      console.error("Error cancelling subscription:", updateError)
      return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message:
        "Subscription cancelled successfully. You can continue using the service until the end of your billing period.",
    })
  } catch (error) {
    console.error("Error cancelling subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
