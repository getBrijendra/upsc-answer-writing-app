import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Contact Us</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Have questions about Lemura? We're here to help you succeed in your UPSC preparation journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-black">
                        First Name
                      </Label>
                      <Input id="firstName" placeholder="Your first name" className="border-gray-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-black">
                        Last Name
                      </Label>
                      <Input id="lastName" placeholder="Your last name" className="border-gray-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black">
                      Email
                    </Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" className="border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-black">
                      Subject
                    </Label>
                    <Input id="subject" placeholder="What's this about?" className="border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-black">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className="border-gray-200"
                    />
                  </div>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Email Us</h3>
                      <p className="text-gray-600">support@lemura.com</p>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Call Us</h3>
                      <p className="text-gray-600">+91 98765 43210</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Visit Us</h3>
                      <p className="text-gray-600">
                        Lemura Education
                        <br />
                        New Delhi, India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-black mb-3">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-black text-sm">How do I reset my password?</h4>
                      <p className="text-gray-600 text-sm">Use the "Forgot Password" link on the login page.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm">Can I change my subscription plan?</h4>
                      <p className="text-gray-600 text-sm">
                        Yes, you can upgrade or downgrade anytime from your account settings.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm">Is my data secure?</h4>
                      <p className="text-gray-600 text-sm">
                        Absolutely. We use industry-standard encryption to protect your information.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
