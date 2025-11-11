import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-gray-200 bg-white">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <CardTitle className="text-2xl font-bold text-black">Check Your Email</CardTitle>
            <CardDescription className="text-gray-600">We've sent you a verification link</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              Please check your email and click the verification link to activate your account. Once verified, you can
              sign in and start your Civil Service Examination preparation journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
