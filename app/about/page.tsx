import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Users, Award, Lightbulb, Heart, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We aim for excellence in every aspect — from our AI-powered evaluation systems to a seamless user experience.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We’re building a strong, supportive network of UPSC aspirants who grow, learn, and succeed together.",
    },
    {
      icon: Award,
      title: "Success",
      description: "Your success defines ours. We celebrate every aspirant who achieves their dream through Lemura.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously push boundaries to bring the most advanced and effective learning tools to UPSC preparation.",
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by a love for education, we’re committed to making world-class preparation accessible to everyone.",
    },
    {
      icon: Shield,
      title: "Trust",
      description: "We build trust through transparency, reliability, and consistent results that our users can depend on.",
    },
  ]

  const team = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      description: "Former IAS officer with 15+ years of civil service experience and a PhD in Public Administration.",
      image: "/professional-indian-man-suit.png",
    },
    {
      name: "Priya Sharma",
      role: "Head of AI & Technology",
      description: "AI researcher and IIT Delhi alumna specializing in NLP and educational technology innovation.",
      image: "/professional-indian-woman.png",
    },
    {
      name: "Amit Verma",
      role: "Head of Content",
      description: "UPSC CSE Topper (Rank 12, 2018) and an educator with over 8 years of experience in civil services coaching.",
      image: "/professional-indian-man-teacher.jpg",
    },
    {
      name: "Sneha Patel",
      role: "Product Manager",
      description: "MBA from ISB and product strategist focused on learner experience and impactful educational outcomes.",
      image: "/professional-indian-woman-product-manager.jpg",
    },
  ]

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "2M+", label: "Answers Reviewed" },
    { number: "85%", label: "Improvement Rate" },
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
              Lemura is transforming UPSC preparation through Artificial Intelligence — providing every aspirant across India
              with the tools to study smarter, write better, and realize their dream of serving the nation.
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
                    Lemura was founded with a simple vision — to make UPSC preparation equitable and accessible to every aspirant, regardless of background or location.
                  </p>
                  <p>
                    Established in 2023 by a team of former civil servants, AI researchers, and educators, Lemura blends technology and pedagogy to create a holistic, result-oriented learning platform.
                  </p>
                  <p>
                    Today, Lemura supports over 50,000 learners across India — helping them refine their answers, evaluate progress, and build the confidence needed to succeed in the Civil Services Examination.
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
            <h2 className="text-3xl font-bold text-black mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These guiding principles define who we are and how we empower the UPSC community to grow and succeed.
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
              A team of visionaries, educators, and innovators working together to redefine UPSC preparation for the digital age.
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
              To empower every UPSC aspirant with world-class preparation tools, real-time feedback, and a personalized learning experience — helping them build confidence and succeed in their civil services journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Accessible</div>
                <p className="text-gray-300">Making quality education available to every aspirant, everywhere.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Innovative</div>
                <p className="text-gray-300">Using AI to personalize preparation and make learning efficient.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">Effective</div>
                <p className="text-gray-300">Helping aspirants achieve measurable results with every step.</p>
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
            Join thousands of dedicated aspirants who have transformed their UPSC preparation through Lemura’s AI-powered approach.
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
