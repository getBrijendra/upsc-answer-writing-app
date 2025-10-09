import { NextResponse } from "next/server"

// Demo blog posts data
export const demoBlogPosts = [
  {
    id: "1",
    slug: "india-foreign-policy-2024",
    title: "India's Foreign Policy in 2024: Key Developments",
    excerpt:
      "An in-depth analysis of India's diplomatic relations and strategic partnerships in the current geopolitical landscape.",
    content: `<h2>India's foreign policy in 2024</h2><p>India has strengthened its strategic partnerships...</p>`,
    category: "current_affairs",
    date: "2024-01-15",
    author: "Dr. Rajesh Kumar",
    image: "/india-foreign-policy.png",
    readTime: "8 min read",
  },
  {
    id: "2",
    slug: "climate-change-india-challenges",
    title: "Climate Change: India's Challenges and Opportunities",
    excerpt: "Exploring India's climate commitments and the path to sustainable development.",
    content: `<p>India faces the dual challenge of development and environment sustainability...</p>`,
    category: "general_knowledge",
    date: "2024-01-10",
    author: "Prof. Meera Sharma",
    image: "/climate-change-india.jpg",
    readTime: "10 min read",
  },
  {
    id: "3",
    slug: "digital-india-transformation",
    title: "Digital India: Transforming Governance and Society",
    excerpt: "How digital initiatives are revolutionizing public service delivery.",
    content: `<p>The Digital India initiative has fundamentally transformed how citizens interact with services...</p>`,
    category: "current_affairs",
    date: "2024-01-05",
    author: "Amit Verma",
    image: "/digital-india.jpg",
    readTime: "7 min read",
  },
  {
    id: "4",
    slug: "indian-economy-growth-prospects",
    title: "Indian Economy: Growth Prospects and Challenges",
    excerpt: "Analyzing India's economic performance and structural reforms.",
    content: `<p>India's economy continues to show remarkable resilience...</p>`,
    category: "general_knowledge",
    date: "2023-12-28",
    author: "Dr. Priya Nair",
    image: "/indian-economy.jpg",
    readTime: "9 min read",
  },
  {
    id: "5",
    slug: "space-missions-india-achievements",
    title: "India's Space Missions: Recent Achievements and Future Plans",
    excerpt: "Exploring ISRO's remarkable journey and future goals.",
    content: `<p>India's space program achieved new heights with Chandrayaan-3 and Aditya-L1...</p>`,
    category: "news",
    date: "2023-12-15",
    author: "Dr. Kiran Reddy",
    image: "/indian-space-mission.jpg",
    readTime: "10 min read",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const slug = searchParams.get("slug")

    if (slug) {
      const blog = demoBlogPosts.find((post) => post.slug === slug)
      if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 })
      return NextResponse.json(blog)
    }

    let filteredBlogs = demoBlogPosts
    if (category && category !== "All") {
      filteredBlogs = demoBlogPosts.filter((post) => post.category === category.toLowerCase())
    }

    return NextResponse.json(filteredBlogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}
