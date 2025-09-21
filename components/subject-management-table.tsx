"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Subject {
  id: string
  name: string
  description: string | null
  created_at: string
  answer_count: number
  mcq_count: number
}

interface SubjectManagementTableProps {
  subjects: Subject[]
}

export default function SubjectManagementTable({ subjects }: SubjectManagementTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (subjectId: string, subjectName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${subjectName}"? This will also delete all associated answers and MCQ questions.`,
      )
    ) {
      return
    }

    setIsDeleting(subjectId)

    try {
      const supabase = createClient()

      // Delete the subject (cascade will handle related records)
      const { error } = await supabase.from("subjects").delete().eq("id", subjectId)

      if (error) throw error

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error deleting subject:", error)
      alert("Failed to delete subject. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No Subjects Found</h3>
        <p className="text-slate-500 mb-6">Create your first subject to get started.</p>
        <Link href="/admin/subjects/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Add New Subject</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-slate-800">{subject.name}</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {subject.answer_count} answers
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {subject.mcq_count} MCQs
                </Badge>
              </div>
            </div>
            {subject.description && <p className="text-sm text-slate-600 mb-2">{subject.description}</p>}
            <p className="text-xs text-slate-500">Created: {new Date(subject.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/subjects/${subject.id}`}>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/subjects/${subject.id}/edit`}>
              <Button size="sm" variant="outline" className="bg-transparent">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                  disabled={isDeleting === subject.id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {isDeleting === subject.id ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{subject.name}"? This action cannot be undone and will also delete:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>{subject.answer_count} associated answers</li>
                      <li>{subject.mcq_count} associated MCQ questions</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(subject.id, subject.name)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Subject
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )
}
