"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { formatPrice } from "@/lib/razorpay"
import { Calendar, Crown, Pause, Play, X, AlertCircle } from "lucide-react"

interface Subscription {
  id: string
  status: string
  start_date: string
  end_date: string
  auto_renew: boolean
  payment_plans: {
    name: string
    description: string
    credits: number
    price_inr: number
    subscription_duration_days: number
  }
}

export default function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("/api/subscriptions/status")
      if (!response.ok) throw new Error("Failed to fetch subscriptions")

      const data = await response.json()
      setSubscriptions(data.subscriptions || [])
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to load subscriptions",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (subscriptionId: string) => {
    if (
      !confirm(
        "Are you sure you want to cancel this subscription? You can continue using the service until the end of your billing period.",
      )
    ) {
      return
    }

    try {
      setActionLoading(subscriptionId)
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      })

      if (!response.ok) throw new Error("Failed to cancel subscription")

      const data = await response.json()
      toast({
        title: "Subscription Cancelled",
        description: data.message,
      })

      fetchSubscriptions()
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handlePauseResume = async (subscriptionId: string, action: "pause" | "resume") => {
    try {
      setActionLoading(subscriptionId)
      const response = await fetch("/api/subscriptions/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId, action }),
      })

      if (!response.ok) throw new Error(`Failed to ${action} subscription`)

      const data = await response.json()
      toast({
        title: `Subscription ${action === "pause" ? "Paused" : "Resumed"}`,
        description: data.message,
      })

      fetchSubscriptions()
    } catch (error) {
      console.error(`Error ${action}ing subscription:`, error)
      toast({
        title: "Error",
        description: `Failed to ${action} subscription`,
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active", icon: Crown },
      paused: { variant: "secondary" as const, label: "Paused", icon: Pause },
      cancelled: { variant: "destructive" as const, label: "Cancelled", icon: X },
      expired: { variant: "outline" as const, label: "Expired", icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.expired
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any active subscriptions. Subscribe to a plan for unlimited access.
          </p>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Subscriptions</h2>
        <p className="text-muted-foreground">Manage your active subscriptions and billing.</p>
      </div>

      <div className="grid gap-6">
        {subscriptions.map((subscription) => {
          const daysRemaining = getDaysRemaining(subscription.end_date)
          const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0

          return (
            <Card key={subscription.id} className={isExpiringSoon ? "border-yellow-500" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {subscription.payment_plans.name}
                      {getStatusBadge(subscription.status)}
                    </CardTitle>
                    <CardDescription className="mt-1">{subscription.payment_plans.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {formatPrice(subscription.payment_plans.price_inr)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per {subscription.payment_plans.subscription_duration_days === 365 ? "year" : "month"}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Started</div>
                      <div className="text-sm text-muted-foreground">{formatDate(subscription.start_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        {subscription.status === "cancelled" ? "Ends" : "Renews"}
                      </div>
                      <div className="text-sm text-muted-foreground">{formatDate(subscription.end_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Credits</div>
                      <div className="text-sm text-muted-foreground">{subscription.payment_plans.credits} included</div>
                    </div>
                  </div>
                </div>

                {isExpiringSoon && subscription.status === "active" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Expires in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}

                {subscription.status === "cancelled" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800">
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Subscription cancelled. Access ends on {formatDate(subscription.end_date)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex gap-2">
                {subscription.status === "active" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePauseResume(subscription.id, "pause")}
                      disabled={actionLoading === subscription.id}
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancel(subscription.id)}
                      disabled={actionLoading === subscription.id}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                )}

                {subscription.status === "paused" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePauseResume(subscription.id, "resume")}
                    disabled={actionLoading === subscription.id}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </Button>
                )}

                {(subscription.status === "cancelled" || subscription.status === "expired") && (
                  <Button asChild size="sm">
                    <a href="/pricing">Resubscribe</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
