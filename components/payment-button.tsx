"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
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

export default function PaymentButton({ planId, planName, amount, credits, className, children }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    try {
      setLoading(true)

      const supabase = createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase credits.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Create order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        if (orderResponse.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          })
          // Redirect to login instead of continuing
          window.location.href = "/auth/signin"
          return
        }
        throw new Error(errorData.error || "Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      // Configure Razorpay options
      const options = {
        key: orderData.key_id, // Use key_id from order response instead of separate API call
        amount: orderData.amount,
        currency: orderData.currency,
        name: RAZORPAY_CONFIG.company_name,
        description: `${planName} - ${credits} Credits`,
        image: RAZORPAY_CONFIG.image,
        order_id: orderData.orderId,
        theme: RAZORPAY_CONFIG.theme,
        handler: async (response: any) => {
          try {
            const {
              data: { user: currentUser },
              error: verifyAuthError,
            } = await supabase.auth.getUser()

            if (verifyAuthError || !currentUser) {
              toast({
                title: "Authentication Error",
                description: "Please sign in again to complete payment verification.",
                variant: "destructive",
              })
              window.location.href = "/auth/signin"
              return
            }

            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId,
              }),
            })

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json()
              if (verifyResponse.status === 401) {
                toast({
                  title: "Session Expired During Payment",
                  description: "Payment may have succeeded. Please check your credits or contact support.",
                  variant: "destructive",
                })
                window.location.href = "/auth/signin"
                return
              }
              throw new Error(errorData.error || "Payment verification failed")
            }

            const verifyData = await verifyResponse.json()

            toast({
              title: "Payment Successful!",
              description: `${verifyData.creditsAdded} credits added to your account. New balance: ${verifyData.newBalance}`,
            })

            setTimeout(() => {
              window.location.href = "/dashboard"
            }, 2000)
          } catch (error) {
            console.error("Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={loading} className={className}>
      {loading ? "Processing..." : children}
    </Button>
  )
}
