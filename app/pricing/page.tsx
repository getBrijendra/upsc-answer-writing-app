"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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

  const handlePurchase = async (planId: string) => {
    // TODO: Implement Razorpay payment flow
    console.log("Purchase plan:", planId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pricing plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">Choose Your UPSC Credits</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Flexible credit packages and subscription plans to power your UPSC preparation journey.
          </p>

          {/* Tab Switcher */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="bg-muted p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("credits")}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "credits"
                    ? "bg-background text-foreground shadow-sm"
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
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Crown className="w-4 h-4 inline mr-2" />
                Subscriptions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Packages */}
      {activeTab === "credits" && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">One-Time Credit Packages</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Buy credits once and use them as needed. Perfect for flexible learning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
              {creditPlans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all hover:shadow-lg h-full flex flex-col ${
                    index === 1 ? "border-2 border-accent shadow-lg" : "border border-border"
                  }`}
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 h-8 flex items-center justify-center">
                    {index === 1 && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-xl font-bold text-foreground">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-foreground">{formatPrice(plan.price_inr)}</span>
                    </div>
                    <CardDescription className="mt-2 min-h-[3rem] flex items-center justify-center">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                      <span className="text-2xl font-bold text-accent">{plan.credits}</span>
                      <span className="text-sm text-muted-foreground ml-1">credits</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">AI Answer Reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">MCQ Generation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Never Expires</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
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
                        className={`w-full ${
                          index === 1
                            ? "bg-accent text-accent-foreground hover:bg-accent/90"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        Purchase Now
                      </PaymentButton>
                    ) : (
                      <Link href="/auth/login" className="w-full">
                        <Button
                          className={`w-full ${
                            index === 1
                              ? "bg-accent text-accent-foreground hover:bg-accent/90"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          Sign In to Purchase
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
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
              <h2 className="text-3xl font-bold text-foreground mb-4">Subscription Plans</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unlimited access with monthly or yearly billing. Best value for regular users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
              {subscriptionPlans.map((plan, index) => (
                <Card
                  key={plan.id}
                  className={`relative transition-all hover:shadow-lg h-full flex flex-col ${
                    index === 1 ? "border-2 border-accent shadow-lg" : "border border-border"
                  }`}
                >
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 h-8 flex items-center justify-center">
                    {index === 1 && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Crown className="w-3 h-3 mr-1" />
                        Best Value
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="text-center pb-6 pt-8">
                    <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{formatPrice(plan.price_inr)}</span>
                      <span className="text-muted-foreground ml-2">
                        /{plan.subscription_duration_days === 365 ? "year" : "month"}
                      </span>
                    </div>
                    <CardDescription className="mt-2 min-h-[3rem] flex items-center justify-center">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                      <span className="text-2xl font-bold text-accent">{plan.credits}</span>
                      <span className="text-sm text-muted-foreground ml-1">credits included</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Unlimited AI Reviews</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Unlimited MCQ Generation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Priority Support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Advanced Analytics</span>
                      </div>
                    </div>
                    {plan.subscription_duration_days === 365 && (
                      <div className="text-xs text-accent font-medium mt-4 pt-4 border-t border-border">
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
                        className={`w-full ${
                          index === 1
                            ? "bg-accent text-accent-foreground hover:bg-accent/90"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        Subscribe Now
                      </PaymentButton>
                    ) : (
                      <Link href="/auth/login" className="w-full">
                        <Button
                          className={`w-full ${
                            index === 1
                              ? "bg-accent text-accent-foreground hover:bg-accent/90"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          Sign In to Subscribe
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Credit Usage Info */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How Credits Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Understand how your credits are used across different features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Answer Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent mb-2">10 Credits</div>
                <p className="text-sm text-muted-foreground">
                  Get detailed AI feedback on your answer writing with suggestions for improvement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">MCQ Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent mb-2">5 Credits</div>
                <p className="text-sm text-muted-foreground">
                  Generate practice MCQs from any content or topic for targeted preparation.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Daily Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-2">Free</div>
                <p className="text-sm text-muted-foreground">
                  Access daily practice questions without using any credits. Always free!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your UPSC Preparation?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of successful UPSC aspirants who trust our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setActiveTab("credits")}
              className="bg-background text-foreground hover:bg-background/90"
            >
              Buy Credits Now
            </Button>
            <Button
              onClick={() => setActiveTab("subscription")}
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Try Subscription
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
