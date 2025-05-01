"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { resendVerification } from "@/lib/ApiService"


export default function VerificationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: (data) => {
      setResendStatus('Verification email sent successfully')
      setTimeout(() => setResendStatus(null), 5000) // Clear message after 5 seconds
    },
    onError: (error) => {
      setResendStatus('Failed to resend verification email')
      setTimeout(() => setResendStatus(null), 5000)
    },
  })

  const handleResend = () => {
    if (email) {
      resendMutation.mutate({ email })
    } else {
      setResendStatus('Email address not found')
      setTimeout(() => setResendStatus(null), 5000)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E2634] rounded-2xl p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-[#F6BE00]/20 rounded-full flex items-center justify-center mb-6">
          <Mail className="h-8 w-8 text-[#F6BE00]" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Check your email</h1>

        <p className="text-[#A6A6A6] mb-6">
          We've sent a verification link to {email || 'your email address'}. Please check your inbox and click the link to verify
          your account.
        </p>

        {resendStatus && (
          <div className={`text-sm mb-4 ${resendStatus.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {resendStatus}
          </div>
        )}

        <div className="bg-[#0A0F1D] rounded-lg p-4 mb-6">
          <p className="text-sm text-[#A6A6A6]">
            If you don't see the email in your inbox, please check your spam folder or request a new verification link.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-bold py-3 rounded-md"
          >
            {resendMutation.isPending ? 'Sending...' : 'Resend verification email'}
          </Button>

          <p className="text-sm text-[#A6A6A6]">
            Already verified?{' '}
            <Link href="/auth/login" className="text-[#F6BE00] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}