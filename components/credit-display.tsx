"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Coins } from "lucide-react"

interface UserCredits {
  credits: number
}

export default function CreditDisplay() {
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase.from("user_credits").select("credits").eq("user_id", user.id).single()

          if (error) {
            console.error("Error fetching credits:", error)
            setCredits(0)
          } else {
            setCredits(data?.credits || 0)
          }
        }
      } catch (error) {
        console.error("Error:", error)
        setCredits(0)
      } finally {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
        <Coins className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-500">...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-full">
      <Coins className="w-4 h-4 text-yellow-400" />
      <span className="text-sm font-medium">{credits || 0}</span>
    </div>
  )
}
