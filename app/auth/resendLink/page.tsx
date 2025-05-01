"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { resendPasswordVerification } from "@/lib/ApiService"
import {  toast } from "sonner" // Import Sonner Toaster and toast

export default function PasswordResetVerificationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const resendMutation = useMutation({
    mutationFn: resendPasswordVerification,
    onSuccess: () => {
      // Show success toast
      toast.success("Reset Link Sent", {
        description: "A new password reset verification link has been sent to your email.",
        duration: 3000,
      })
    },
    onError: (error: any) => {
      // Show error toast
      toast.error("Failed to Resend", {
        description: error.message || "Unable to resend password reset link. Please try again.",
        duration: 5000,
      })
    },
  })

  const handleResend = () => {
    if (email) {
      resendMutation.mutate({ email })
    } else {
      // Show warning toast
      toast.warning("Email Not Found", {
        description: "No email address provided. Please try again from the forgot password page.",
        duration: 5000,
      })
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
          We've sent a password reset verification link to {email || "your email address"}. Please check your inbox and
          click the link to reset your password.
        </p>

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
            {resendMutation.isPending ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-black"
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

          <p className="text-sm text-[#A6A6A6]">
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