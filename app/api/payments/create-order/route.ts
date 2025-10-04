// app/api/payments/create-order/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()
    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Get the Bearer token (if passed)
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined

    const supabase = await createClient(token)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 })
    }

    // Fetch plan
    const { data: plan, error: planError } = await supabase
      .from("payment_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    const order = await razorpay.orders.create({
      amount: plan.price_inr,
      currency: "INR",
      receipt: `order_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan_id: plan.id,
        plan_name: plan.name,
      },
    })

    await supabase.from("payments").insert({
      user_id: user.id,
      plan_id: plan.id,
      razorpay_order_id: order.id,
      amount: plan.price_inr,
      currency: "INR",
      status: "pending",
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
