"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreditCost {
  id: string
  operation_type: string
  cost: number
  description: string
  created_at: string
  updated_at: string
}

interface CreditManagementTableProps {
  creditCosts: CreditCost[]
}

export default function CreditManagementTable({ creditCosts }: CreditManagementTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingCost, setEditingCost] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEdit = (cost: CreditCost) => {
    setEditingId(cost.id)
    setEditingCost(cost.cost)
  }

  const handleSave = async (id: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("credit_costs")
        .update({ cost: editingCost, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) {
        console.error("Error updating credit cost:", error)
        alert("Failed to update credit cost")
      } else {
        setEditingId(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to update credit cost")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingCost(0)
  }

  const getOperationDisplayName = (operationType: string) => {
    const names: { [key: string]: string } = {
      answer_review: "Answer Review",
      quiz_generation: "Quiz Generation",
      essay_review: "Essay Review",
      daily_question_review: "Daily Question Review",
    }
    return names[operationType] || operationType
  }

  const getOperationColor = (operationType: string) => {
    const colors: { [key: string]: string } = {
      answer_review: "bg-blue-100 text-blue-800",
      quiz_generation: "bg-green-100 text-green-800",
      essay_review: "bg-purple-100 text-purple-800",
      daily_question_review: "bg-orange-100 text-orange-800",
    }
    return colors[operationType] || "bg-gray-100 text-gray-800"
  }

  if (creditCosts.length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Coins className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Credit Costs Found</h3>
          <p className="text-gray-600 text-center">
            Credit costs will appear here once they are configured in the database.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {creditCosts.map((cost) => (
        <Card key={cost.id} className="bg-white border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className={getOperationColor(cost.operation_type)}>
                  {getOperationDisplayName(cost.operation_type)}
                </Badge>
                <CardTitle className="text-lg text-black">
                  {editingId === cost.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editingCost}
                        onChange={(e) => setEditingCost(Number.parseInt(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                      />
                      <span className="text-sm text-gray-600">credits</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span>{cost.cost} credits</span>
                    </div>
                  )}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {editingId === cost.id ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleSave(cost.id)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading}>
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => handleEdit(cost)} className="hover:bg-gray-100">
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">{cost.description}</CardDescription>
            <div className="mt-2 text-xs text-gray-500">
              Last updated: {new Date(cost.updated_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
