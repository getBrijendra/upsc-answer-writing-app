import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, Users } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy</h1>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us. This policy explains how Lemura collects, uses, and protects your
              information.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <Eye className="w-5 h-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-black mb-2">Personal Information</h3>
                  <p>
                    We collect information you provide directly to us, such as when you create an account, use our
                    services, or contact us. This includes:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Name and email address</li>
                    <li>Profile information</li>
                    <li>UPSC preparation data and progress</li>
                    <li>Answer submissions and feedback</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Usage Information</h3>
                  <p>We automatically collect certain information about your use of our platform, including:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Device and browser information</li>
                    <li>IP address and location data</li>
                    <li>Usage patterns and preferences</li>
                    <li>Performance and analytics data</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <Users className="w-5 h-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide, maintain, and improve our UPSC preparation services</li>
                  <li>Generate personalized feedback and recommendations</li>
                  <li>Track your progress and performance analytics</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <Lock className="w-5 h-5" />
                  Data Security & Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Secure data storage with trusted providers</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of certain communications</li>
                  <li>File a complaint with relevant authorities</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Email:</strong> privacy@lemura.com
                  </p>
                  <p>
                    <strong>Address:</strong> Lemura Privacy Team, India
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
