"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
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
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const refreshSession = async () => {
      const { error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("[v0] Session refresh error:", error)
      }
    }
    refreshSession()
  }, [supabase])

  const handlePayment = async () => {
    try {
      setLoading(true)

      const { error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) {
        console.error("[v0] Session refresh failed:", refreshError)
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error("[v0] Auth check failed:", authError)
        toast({
          title: "Authentication Required",
          description: "Please sign in to purchase credits.",
          variant: "destructive",
        })
        window.location.href = "/auth/login"
        return
      }

      console.log("[v0] User authenticated, creating order for:", user.id)

      sessionStorage.setItem("payment_user_id", user.id)
      sessionStorage.setItem("payment_plan_id", planId)

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
        console.error("[v0] Order creation failed:", errorData)
        if (orderResponse.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please sign in again to continue.",
            variant: "destructive",
          })
          window.location.href = "/auth/login"
          return
        }
        throw new Error(errorData.error || "Failed to create order")
      }

      const orderData = await orderResponse.json()
      console.log("[v0] Order created successfully:", orderData.orderId)

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
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: RAZORPAY_CONFIG.company_name,
        description: `${planName} - ${credits} Credits`,
        image: RAZORPAY_CONFIG.image,
        order_id: orderData.orderId,
        theme: RAZORPAY_CONFIG.theme,
        handler: async (response: any) => {
          try {
            console.log("[v0] Payment completed, verifying...")

            const { error: postPaymentRefreshError } = await supabase.auth.refreshSession()
            if (postPaymentRefreshError) {
              console.error("[v0] Post-payment session refresh failed:", postPaymentRefreshError)
            }

            const {
              data: { user: currentUser },
              error: verifyAuthError,
            } = await supabase.auth.getUser()

            if (verifyAuthError || !currentUser) {
              console.error("[v0] Auth verification failed after payment:", verifyAuthError)
              toast({
                title: "Session Issue",
                description: "Payment completed but session expired. Please check your credits or contact support.",
                variant: "destructive",
              })
              setTimeout(() => {
                window.location.href = "/auth/login"
              }, 3000)
              return
            }

            console.log("[v0] User verified, processing payment verification...")

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
              console.error("[v0] Payment verification failed:", errorData)
              if (verifyResponse.status === 401) {
                toast({
                  title: "Session Expired",
                  description: "Payment may have succeeded. Please check your credits or contact support.",
                  variant: "destructive",
                })
                setTimeout(() => {
                  window.location.href = "/auth/login"
                }, 3000)
                return
              }
              throw new Error(errorData.error || "Payment verification failed")
            }

            const verifyData = await verifyResponse.json()
            console.log("[v0] Payment verified successfully:", verifyData)

            sessionStorage.removeItem("payment_user_id")
            sessionStorage.removeItem("payment_plan_id")

            toast({
              title: "Payment Successful!",
              description: `${verifyData.creditsAdded} credits added to your account. New balance: ${verifyData.newBalance}`,
            })

            setTimeout(() => {
              window.location.href = "/dashboard"
            }, 2000)
          } catch (error) {
            console.error("[v0] Payment verification error:", error)
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            })
            setLoading(false)
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        modal: {
          ondismiss: () => {
            console.log("[v0] Payment modal dismissed by user")
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("[v0] Payment error:", error)
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
