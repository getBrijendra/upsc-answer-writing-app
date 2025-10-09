import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp, BookOpen, Newspaper } from "lucide-react"
import Link from "next/link"
import { demoBlogPosts } from "@/lib/blog-data"

export default async function BlogsPage() {
  const supabase = await createClient()

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
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">UPSC Knowledge Hub</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Stay updated with the latest current affairs, general knowledge, and news relevant to your UPSC
              preparation
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Badge variant="outline" className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors">
              <BookOpen className="w-4 h-4 mr-2" />
              All Posts
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors bg-blue-50 text-blue-700 border-blue-200"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Current Affairs
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors bg-green-50 text-green-700 border-green-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              General Knowledge
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 cursor-pointer hover:bg-muted transition-colors bg-purple-50 text-purple-700 border-purple-200"
            >
              <Newspaper className="w-4 h-4 mr-2" />
              News
            </Badge>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoBlogPosts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">{formatCategory(post.category)}</span>
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm font-medium text-foreground">By {post.author}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your UPSC Journey?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of aspirants using AI-powered tools to ace their UPSC preparation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-3 bg-background text-foreground border border-border rounded-lg hover:bg-muted transition-colors font-medium">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
