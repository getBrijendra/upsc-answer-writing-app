import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp, BookOpen, Newspaper, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const response = await fetch(`http://localhost:3000/api/blogs?slug=${params.slug}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    redirect("/blogs")
  }

  const post = await response.json()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "current_affairs":
        return <TrendingUp className="w-4 h-4" />
      case "general_knowledge":
        return <BookOpen className="w-4 h-4" />
      case "news":
        return <Newspaper className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "current_affairs":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "general_knowledge":
        return "bg-green-100 text-green-800 border-green-200"
      case "news":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Featured Image */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={post.image || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/blogs">
            <Button variant="ghost" className="mb-6 hover:bg-muted">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>

          {/* Article Header */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
            <Badge className={`${getCategoryColor(post.category)} mb-4`}>
              {getCategoryIcon(post.category)}
              <span className="ml-1">{formatCategory(post.category)}</span>
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">By {post.author}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-border">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>

          {/* Article Body */}
          <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* CTA Section */}
          <div className="bg-muted/30 rounded-lg p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Ace Your UPSC Preparation?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of aspirants using AI-powered tools for answer writing practice, MCQ generation, and
              personalized feedback
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
