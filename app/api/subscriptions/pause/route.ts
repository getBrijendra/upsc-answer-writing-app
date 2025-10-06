import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, action } = await request.json()

    if (!subscriptionId || !action || !["pause", "resume"].includes(action)) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }

    const supabase = createServerClient()
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

    const validStatuses = action === "pause" ? ["active"] : ["paused"]
    if (!validStatuses.includes(subscription.status)) {
      return NextResponse.json(
        {
          error: `Cannot ${action} subscription with status: ${subscription.status}`,
        },
        { status: 400 },
      )
    }

    const newStatus = action === "pause" ? "paused" : "active"

    // Update subscription status
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId)

    if (updateError) {
      console.error(`Error ${action}ing subscription:`, updateError)
      return NextResponse.json({ error: `Failed to ${action} subscription` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Subscription ${action}d successfully.`,
      newStatus,
    })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
