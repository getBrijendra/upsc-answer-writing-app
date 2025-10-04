"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { RAZORPAY_CONFIG } from "@/lib/razorpay"

interface PaymentButtonProps {
  planId: string
  planName: string
  amount: number
  credits: number
  className?: string
  children: React.ReactNode
}

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentButton({ planId, planName, amount, credits, className, children } : PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        toast({ title: "Please sign in to continue", variant: "destructive" })
        window.location.href = "/auth/login"
        return
      }

      // ✅ Pass access token
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ planId }),
      })

      if (!res.ok) throw new Error("Order creation failed")
      const order = await res.json()

      // ✅ Load Razorpay
      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const s = document.createElement("script")
          s.src = "https://checkout.razorpay.com/v1/checkout.js"
          s.onload = resolve
          document.body.appendChild(s)
        })
      }

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: RAZORPAY_CONFIG.company_name,
        description: `${planName} - ${credits} Credits`,
        image: RAZORPAY_CONFIG.image,
        order_id: order.orderId,
        theme: RAZORPAY_CONFIG.theme,
        handler: () => {
          toast({ title: "Payment Successful!", description: "Credits will be added shortly." })
          setTimeout(() => (window.location.href = "/dashboard"), 1500)
        },
        modal: { ondismiss: () => setLoading(false) },
      }

      new window.Razorpay(options).open()
    } catch (err) {
      console.error(err)
      toast({ title: "Payment failed", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? "Processing..." : children}
    </Button>
  )
}