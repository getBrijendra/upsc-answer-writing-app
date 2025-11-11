import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, Users } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Terms of Service</h1>
            <p className="text-gray-600 text-lg">
              Please read these terms carefully before using Lemura's Civil Service Examination preparation platform.
            </p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <Scale className="w-5 h-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  By accessing and using Lemura's platform, you accept and agree to be bound by the terms and provision
                  of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  These terms apply to all users of the platform, including students, educators, and administrators.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <Users className="w-5 h-5" />
                  User Accounts & Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold text-black mb-2">Account Creation</h3>
                  <p>
                    You must provide accurate and complete information when creating your account. You are responsible
                    for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Acceptable Use</h3>
                  <p>
                    You agree to use our platform only for lawful purposes and in accordance with these terms. You must
                    not:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Share your account with others</li>
                    <li>Upload malicious content or spam</li>
                    <li>Attempt to gain unauthorized access</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Interfere with the platform's operation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Service Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  We strive to provide continuous access to our platform, but we cannot guarantee 100% uptime. We
                  reserve the right to modify, suspend, or discontinue any part of our service with or without notice.
                </p>
                <p>
                  Scheduled maintenance and updates may temporarily affect service availability. We will make reasonable
                  efforts to notify users of planned maintenance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  All content, features, and functionality of our platform are owned by Lemura and are protected by
                  copyright, trademark, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of the content you create and submit through our platform, but you grant us a
                  license to use this content to provide and improve our services.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <AlertTriangle className="w-5 h-5" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  Lemura provides this platform "as is" without any warranties, express or implied. We do not guarantee
                  that our service will meet your specific requirements or be error-free.
                </p>
                <p>
                  In no event shall Lemura be liable for any indirect, incidental, special, consequential, or punitive
                  damages arising from your use of our platform.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Termination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature. We
                  may terminate or suspend your account if you violate these terms.
                </p>
                <p>
                  Upon termination, your right to use the platform will cease immediately, and we may delete your
                  account data.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p>
                    <strong>Email:</strong> legal@lemura.com
                  </p>
                  <p>
                    <strong>Address:</strong> Lemura Legal Team, India
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
