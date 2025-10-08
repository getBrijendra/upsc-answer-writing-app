import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const Razorpay = require("razorpay")

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_RAZORPAY_ID || !process.env.RAZORPAY_SECRET) {
      console.error("[v0] Razorpay credentials not configured")
      return NextResponse.json({ error: "Payment system not configured. Please contact support." }, { status: 500 })
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Get user from session
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Authentication failed in create-order:", authError)
      return NextResponse.json({ error: "Authentication required. Please sign in again." }, { status: 401 })
    }

    console.log("[v0] User authenticated for payment:", user.id)

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("payment_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single()

    if (planError || !plan) {
      console.error("[v0] Plan not found:", planError)
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    let razorpayInstance
    try {
      razorpayInstance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      })
    } catch (razorpayError) {
      console.error("[v0] Razorpay initialization failed:", razorpayError)
      return NextResponse.json(
        { error: "Payment gateway initialization failed. Please try again later." },
        { status: 500 },
      )
    }

    // Create Razorpay order
    const orderOptions = {
      amount: plan.price_inr, // Amount in paise
      currency: "INR",
      receipt: `order_${user.id}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_id: planId,
        plan_name: plan.name,
        credits: plan.credits.toString(),
      },
    }

    let razorpayOrder
    try {
      razorpayOrder = await razorpayInstance.orders.create(orderOptions)
    } catch (razorpayError) {
      console.error("[v0] Razorpay order creation failed:", razorpayError)
      return NextResponse.json({ error: "Failed to create payment order. Please try again." }, { status: 500 })
    }

    // Store payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        plan_id: planId,
        razorpay_order_id: razorpayOrder.id,
        amount: plan.price_inr,
        currency: "INR",
        status: "pending",
      })
      .select()
      .single()

    if (paymentError) {
      console.error("[v0] Error creating payment record:", paymentError)
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 })
    }

    const publicKeyId = process.env.NEXT_PUBLIC_RAZORPAY_ID || ""

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      paymentId: payment.id,
      planName: plan.name,
      credits: plan.credits,
      key_id: publicKeyId,
    })
  } catch (error) {
    console.error("[v0] Unexpected error in create-order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}
