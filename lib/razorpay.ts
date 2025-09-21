// Razorpay configuration and utilities
export const RAZORPAY_CONFIG = {
  currency: "INR",
  company_name: "UPSC Answer Writing App",
  description: "Credit Purchase",
  image: "/logo.png", // Add your logo
  theme: {
    color: "#000000",
  },
}

export interface PaymentPlan {
  id: string
  name: string
  description: string
  credits: number
  price_inr: number
  plan_type: "one_time" | "subscription"
  subscription_duration_days?: number
  is_active: boolean
}

export interface RazorpayOrderData {
  id: string
  amount: number
  currency: string
  receipt: string
}

export interface RazorpayPaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

// Format price for display
export const formatPrice = (priceInPaise: number): string => {
  return `₹${(priceInPaise / 100).toLocaleString("en-IN")}`
}

// Calculate savings for subscription plans
export const calculateSavings = (yearlyPrice: number, monthlyPrice: number): number => {
  const monthlyTotal = monthlyPrice * 12
  return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100)
}
