"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Network, Layers, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SavedItem {
  id: string
  title: string
  content?: string
  created_at: string
  updated_at: string
}

interface SavedItemsGridProps {
  items: SavedItem[]
  type: "mindmap" | "flashcard"
}

export default function SavedItemsGrid({ items, type }: SavedItemsGridProps) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return

    const supabase = createClient()
    const tableName = type === "mindmap" ? "mindmaps" : "flashcard_sets"

    const { error } = await supabase.from(tableName).delete().eq("id", id)

    if (error) {
      toast.error(`Failed to delete ${type}`)
    } else {
      toast.success(`${type === "mindmap" ? "Mindmap" : "Flashcard set"} deleted successfully`)
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {type === "mindmap" ? (
            <Network className="w-8 h-8 text-gray-400" />
          ) : (
            <Layers className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <p className="text-gray-600 mb-4">No {type === "mindmap" ? "mindmaps" : "flashcard sets"} created yet</p>
        <Link href="/dashboard">
          <Button className="bg-black hover:bg-gray-800 text-white">
            Create {type === "mindmap" ? "Mindmap" : "Flashcards"}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {type === "mindmap" ? (
                  <Network className="w-5 h-5 text-black" />
                ) : (
                  <Layers className="w-5 h-5 text-black" />
                )}
                <CardTitle className="text-lg text-black">{item.title}</CardTitle>
              </div>
            </div>
            <CardDescription className="text-gray-600 text-sm">
              Created {new Date(item.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Link href={`/${type === "mindmap" ? "mindmap" : "flashcards"}/${item.id}`} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(item.id)}
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
