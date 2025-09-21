import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"
import { addCreditsServer } from "@/lib/credits-server"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user from session
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Authentication failed in payment verification:", authError)
      return NextResponse.json({ error: "Authentication required. Please sign in again." }, { status: 401 })
    }

    console.log("[v0] User authenticated for payment verification:", user.id)

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select(`
        *,
        payment_plans (*)
      `)
      .eq("id", paymentId)
      .eq("user_id", user.id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId)

    if (updateError) {
      console.error("Error updating payment:", updateError)
      return NextResponse.json({ error: "Failed to update payment" }, { status: 500 })
    }

    // Add credits to user account using existing credit system
    const {
      success: creditSuccess,
      new_credits,
      error: creditError,
    } = await addCreditsServer(user.id, payment.payment_plans.credits)

    if (!creditSuccess) {
      console.error("Error updating user credits:", creditError)
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
    }

    // Create subscription record if it's a subscription plan
    if (payment.payment_plans.plan_type === "subscription") {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + payment.payment_plans.subscription_duration_days)

      const { error: subscriptionError } = await supabase.from("subscriptions").insert({
        user_id: user.id,
        plan_id: payment.plan_id,
        payment_id: paymentId,
        status: "active",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        auto_renew: true,
      })

      if (subscriptionError) {
        console.error("Error creating subscription:", subscriptionError)
        // Don't fail the payment, just log the error
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      creditsAdded: payment.payment_plans.credits,
      newBalance: new_credits,
    })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
