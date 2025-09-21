import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Award, Lightbulb, Heart, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our AI algorithms to user experience.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive community of UPSC aspirants who learn and grow together.",
    },
    {
      icon: Award,
      title: "Success",
      description: "Your success is our success. We measure our impact by your achievements.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously innovating to bring you the most effective preparation tools.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Passionate about education and committed to making quality preparation accessible.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Building trust through transparency, reliability, and consistent results.",
    },
  ]

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      description: "Former IAS officer with 15+ years in civil services. PhD in Public Administration.",
      image: "/professional-indian-man-suit.png",
    },
    {
      name: "Priya Sharma",
      role: "Head of AI & Technology",
      description: "AI researcher with expertise in NLP and educational technology. IIT Delhi alumna.",
      image: "/professional-indian-woman.png",
    },
    {
      name: "Amit Verma",
      role: "Head of Content",
      description: "UPSC CSE topper (Rank 12, 2018) and experienced educator with 8+ years in coaching.",
      image: "/professional-indian-man-teacher.jpg",
    },
    {
      name: "Sneha Patel",
      role: "Product Manager",
      description: "Product strategist focused on user experience and educational outcomes. MBA from ISB.",
      image: "/professional-indian-woman-product-manager.jpg",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "2M+", label: "Answers Evaluated" },
    { number: "85%", label: "Success Rate" },
    { number: "4.9/5", label: "User Rating" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">About Lemura</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're on a mission to democratize UPSC preparation by making high-quality, AI-powered learning tools
              accessible to every aspirant across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button className="bg-black text-white hover:bg-gray-800">Join Our Community</Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-black mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Lemura was born from a simple observation: UPSC preparation shouldn't be limited by geography,
                    economic background, or access to expensive coaching institutes.
                  </p>
                  <p>
                    Founded in 2023 by a team of former civil servants, AI researchers, and educators, we set out to
                    create the most comprehensive and accessible UPSC preparation platform in India.
                  </p>
                  <p>
                    Today, we're proud to serve over 50,000 aspirants across the country, helping them improve their
                    answer writing skills, track their progress, and achieve their dreams of serving the nation.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/modern-office-collaboration.png"
                  alt="Lemura team working together"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape how we serve our community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl text-black">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-black mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our diverse team brings together expertise in civil services, technology, and education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <CardTitle className="text-lg text-black">{member.name}</CardTitle>
                  <CardDescription className="text-gray-600 font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm text-center">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              To empower every UPSC aspirant with world-class preparation tools, personalized feedback, and the
              confidence to succeed in their civil services journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Accessible</div>
                <p className="text-gray-300">Quality education for all, regardless of background</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Innovative</div>
                <p className="text-gray-300">Cutting-edge AI technology for personalized learning</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Effective</div>
                <p className="text-gray-300">Proven methods that deliver real results</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful aspirants who have transformed their UPSC preparation with Lemura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-black text-white hover:bg-gray-800">Start Free Today</Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              >
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
