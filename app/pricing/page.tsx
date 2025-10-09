"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice, type PaymentPlan } from "@/lib/razorpay"
import PaymentButton from "@/components/payment-button"
import Link from "next/link"

export default function PricingPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"credits" | "subscription">("credits")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    fetchPlans()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setIsAuthenticated(!!session)
  }

  const fetchPlans = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("payment_plans")
        .select("*")
        .eq("is_active", true)
        .order("price_inr", { ascending: true })

      if (error) throw error
      setPlans(data || [])
    } catch (error) {
      console.error("Error fetching plans:", error)
    } finally {
      setLoading(false)
    }
  }

  const creditPlans = plans.filter((plan) => plan.plan_type === "one_time")
  const subscriptionPlans = plans.filter((plan) => plan.plan_type === "subscription")

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading pricing plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-secondary/20 via-background to-background">
        <div className="container relative mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight"
          >
            Choose Your <span className="text-primary">UPSC Plan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto"
          >
            Flexible credit packages and subscriptions to supercharge your UPSC preparation.
          </motion.p>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <div className="bg-card p-1 rounded-lg shadow-inner border border-border">
              <button
                onClick={() => setActiveTab("credits")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "credits"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                Credit Packages
              </button>
              <button
                onClick={() => setActiveTab("subscription")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "subscription"
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Subscriptions
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credit Packages */}
      {activeTab === "credits" && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">One-Time Credit Packages</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Buy credits once and use them anytime — perfect for flexible learners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {creditPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className={`relative bg-card border-2 ${
                      index === 1
                        ? "border-primary shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    } transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      {index === 1 && (
                        <Badge className="bg-primary text-primary-foreground animate-pulse">
                          <Star className="w-3 h-3 mr-1" /> Most Popular
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="text-center pb-6 pt-8">
                      <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-4 text-3xl font-bold text-primary">{formatPrice(plan.price_inr)}</div>
                      <CardDescription className="mt-2 min-h-[3rem]">{plan.description}</CardDescription>
                      <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                        <span className="text-2xl font-bold text-primary">{plan.credits}</span>
                        <span className="text-sm text-muted-foreground ml-1">credits</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-muted-foreground">
                      {["AI Answer Reviews", "MCQ Generation", "Never Expires"].map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                      <div className="text-xs mt-4 pt-4 border-t border-border">
                        ≈ {Math.round(plan.price_inr / plan.credits)} paise per credit
                      </div>
                    </CardContent>

                    <CardFooter className="pt-6">
                      {isAuthenticated ? (
                        <PaymentButton
                          planId={plan.id}
                          planName={plan.name}
                          amount={plan.price_inr}
                          credits={plan.credits}
                          className={`w-full transition-transform hover:scale-[1.03] ${
                            index === 1
                              ? "bg-primary text-primary-foreground hover:opacity-90"
                              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          Purchase Now
                        </PaymentButton>
                      ) : (
                        <Link href="/auth/login" className="w-full">
                          <Button
                            className={`w-full transition-transform hover:scale-[1.03] ${
                              index === 1
                                ? "bg-primary text-primary-foreground hover:opacity-90"
                                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                            }`}
                          >
                            Sign In to Purchase
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscription Plans */}
      {activeTab === "subscription" && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Subscription Plans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Go unlimited with monthly or yearly plans — best for consistent learners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {subscriptionPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    className={`relative bg-card border-2 ${
                      index === 1
                        ? "border-primary shadow-lg shadow-primary/20"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    } transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      {index === 1 && (
                        <Badge className="bg-primary text-primary-foreground animate-pulse">
                          <Crown className="w-3 h-3 mr-1" /> Best Value
                        </Badge>
                      )}
                    </div>

                    <CardHeader className="text-center pb-6 pt-8">
                      <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-primary">{formatPrice(plan.price_inr)}</span>
                        <span className="text-muted-foreground ml-2">
                          /{plan.subscription_duration_days === 365 ? "year" : "month"}
                        </span>
                      </div>
                      <CardDescription className="mt-2 min-h-[3rem]">{plan.description}</CardDescription>
                      <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                        <span className="text-2xl font-bold text-primary">{plan.credits}</span>
                        <span className="text-sm text-muted-foreground ml-1">credits included</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 text-muted-foreground">
                      {[
                        "Unlimited AI Reviews",
                        "Unlimited MCQ Generation",
                        "Priority Support",
                        "Advanced Analytics",
                      ].map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-primary" />
                          <span className="text-sm">{f}</span>
                        </div>
                      ))}
                      {plan.subscription_duration_days === 365 && (
                        <div className="text-xs text-primary font-medium mt-4 pt-4 border-t border-border">
                          Save{" "}
                          {Math.round(
                            ((subscriptionPlans[0]?.price_inr * 12 - plan.price_inr) /
                              (subscriptionPlans[0]?.price_inr * 12)) *
                              100,
                          )}
                          % vs Monthly
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-6">
                      {isAuthenticated ? (
                        <PaymentButton
                          planId={plan.id}
                          planName={plan.name}
                          amount={plan.price_inr}
                          credits={plan.credits}
                          className={`w-full transition-transform hover:scale-[1.03] ${
                            index === 1
                              ? "bg-primary text-primary-foreground hover:opacity-90"
                              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          Subscribe Now
                        </PaymentButton>
                      ) : (
                        <Link href="/auth/login" className="w-full">
                          <Button
                            className={`w-full transition-transform hover:scale-[1.03] ${
                              index === 1
                                ? "bg-primary text-primary-foreground hover:opacity-90"
                                : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                            }`}
                          >
                            Sign In to Subscribe
                          </Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Ready to Start Your UPSC Journey?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the plan that fits your learning style and take the first step toward success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setActiveTab("credits")}
              className="bg-primary text-primary-foreground hover:opacity-90 px-8 py-5 rounded-full font-semibold transition-all"
            >
              Buy Credits Now
            </Button>
            <Button
              onClick={() => setActiveTab("subscription")}
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-5 rounded-full font-semibold transition-all"
            >
              Try Subscription
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
