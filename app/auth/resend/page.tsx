"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { resendVerification } from "@/lib/ApiService"
import { toast } from "sonner"

export default function VerificationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const resendMutation = useMutation({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success("Verification Email Sent", {
        description: "A new verification link has been sent to your email.",
        duration: 3000,
      })
    },
    onError: (error: any) => {
      // Extract error message from response
      const errorMessage = error?.response?.data?.error || error.message || "Unable to resend verification email. Please try again.";

      toast.error("Error", {
        description: errorMessage,
        duration: 5000,
      })
    },
  })

  const handleResend = () => {
    if (email) {
      resendMutation.mutate({ email })
    } else {
      toast.warning("Email Not Found", {
        description: "No email address provided. Please try again from the sign-up page.",
        duration: 5000,
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0A0F1D] items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-md bg-[#1E2634] rounded-2xl p-4 md:p-6 text-center">
        <div className="mx-auto w-12 h-12 md:w-14 md:h-14 bg-[#F6BE00]/20 rounded-full flex items-center justify-center mb-4 md:mb-5">
          <Mail className="h-6 w-6 md:h-7 md:w-7 text-[#F6BE00]" />
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Check your email</h1>

        <p className="text-[#A6A6A6] text-sm md:text-base mb-4 md:mb-5">
          We've sent a verification link to {email || "your email address"}. Please check your inbox and click the link to
          verify your account.
        </p>

        <div className="bg-[#0A0F1D] rounded-lg p-3 md:p-4 mb-4 md:mb-5">
          <p className="text-xs md:text-sm text-[#A6A6A6]">
            If you don't see the email in your inbox, please check your spam folder or request a new verification link.
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          <Button
            onClick={handleResend}
            disabled={resendMutation.isPending}
            className="w-full bg-[#F6BE00] hover:bg-yellow-600 text-black font-bold py-2 md:py-3 rounded-md"
          >
            {resendMutation.isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-4 w-4 mr-2 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Resend verification email"
            )}
          </Button>

          <p className="text-xs md:text-sm text-[#A6A6A6]">
            Already verified?{" "}
            <Link href="/auth/login" className="text-[#F6BE00] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
